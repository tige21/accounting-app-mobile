import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState, AppStateStatus } from 'react-native'
import dayjs from 'dayjs'
import { taskService } from '@/services/TaskService'
import { migrationService } from '@/services/MigrationService'
import { SyncResult, LocalTask as SupabaseTask } from '@/types/supabase'

interface Task {
	id: string
	title: string
	date: string
	time: string
	repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
	reminder: 'Нет' | 'За 5 минут' | 'За 15 минут' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
	comment?: string
	isCompleted?: boolean
	lastCompletedDate?: string
	notificationTime?: string
	notificationId?: string
}

// Sync state
interface SyncState {
	isLoading: boolean
	lastSyncTime?: string
	isOnline: boolean
	hasPendingSync: boolean
	syncError?: string
}

interface TaskStore {
	tasks: Task[]
	syncState: SyncState
	addTask: (task: Task) => void
	deleteTask: (taskId: string) => void
	updateTask: (taskId: string, updates: Partial<Task>) => void
	cleanCompletedTasks: () => void
	// Sync methods
	syncTasks: () => Promise<SyncResult<Task>>
	initializeSync: () => Promise<void>
	setSyncState: (updates: Partial<SyncState>) => void
	// Migration methods
	startMigration: () => Promise<void>
	getMigrationStatus: () => boolean
}

// Convert between local and Supabase task formats
const convertToSupabaseTask = (task: Task): SupabaseTask => ({
	id: task.id,
	title: task.title,
	date: task.date,
	time: task.time,
	repeat: task.repeat,
	reminder: task.reminder,
	comment: task.comment,
	isCompleted: task.isCompleted,
	lastCompletedDate: task.lastCompletedDate,
	notificationTime: task.notificationTime,
	notificationId: task.notificationId
})

const convertFromSupabaseTask = (task: SupabaseTask): Task => ({
	id: task.id,
	title: task.title,
	date: task.date,
	time: task.time,
	repeat: task.repeat,
	reminder: task.reminder,
	comment: task.comment,
	isCompleted: task.isCompleted,
	lastCompletedDate: task.lastCompletedDate,
	notificationTime: task.notificationTime,
	notificationId: task.notificationId
})

// Helper function to merge local and remote tasks
function mergeTasks(localTasks: Task[], remoteTasks: Task[]): Task[] {
	const taskMap = new Map<string, Task>()
	
	// Add local tasks first
	localTasks.forEach(task => {
		taskMap.set(task.id, task)
	})
	
	// Override with remote tasks (remote takes precedence)
	remoteTasks.forEach(task => {
		taskMap.set(task.id, task)
	})
	
	return Array.from(taskMap.values())
}

export const useTaskStore = create<TaskStore>()(
	persist(
		(set, get) => ({
			tasks: [],
			syncState: {
				isLoading: false,
				isOnline: true,
				hasPendingSync: false
			},

			addTask: async (task: Task) => {
				// Add to local state immediately
				set(state => ({
					tasks: [...state.tasks, task]
				}))

				// Try to sync to Supabase
				try {
					const supabaseTask = convertToSupabaseTask(task)
					await taskService.createTask(supabaseTask)
				} catch (error) {
					console.warn('Failed to sync new task to Supabase:', error)
					set(state => ({
						syncState: { ...state.syncState, hasPendingSync: true }
					}))
				}
			},

			deleteTask: async (taskId: string) => {
				// Remove from local state immediately
				set(state => ({
					tasks: state.tasks.filter(task => task.id !== taskId)
				}))

				// Try to sync deletion to Supabase
				try {
					await taskService.deleteTask(taskId)
				} catch (error) {
					console.warn('Failed to sync task deletion to Supabase:', error)
					set(state => ({
						syncState: { ...state.syncState, hasPendingSync: true }
					}))
				}
			},

			updateTask: async (taskId: string, updates: Partial<Task>) => {
				// Update local state immediately
				const updatedTask = {
					...updates,
					lastCompletedDate: updates.isCompleted
						? dayjs().format('YYYY-MM-DD')
						: undefined
				}

				set(state => ({
					tasks: state.tasks.map(task =>
						task.id === taskId ? { ...task, ...updatedTask } : task
					)
				}))

				// Try to sync update to Supabase
				try {
					const currentTask = get().tasks.find(t => t.id === taskId)
					if (currentTask) {
						const supabaseTask = convertToSupabaseTask({ ...currentTask, ...updatedTask })
						await taskService.updateTask(taskId, supabaseTask)
					}
				} catch (error) {
					console.warn('Failed to sync task update to Supabase:', error)
					set(state => ({
						syncState: { ...state.syncState, hasPendingSync: true }
					}))
				}
			},

			// Sync methods
			syncTasks: async (): Promise<SyncResult<Task>> => {
				set(state => ({
					syncState: { ...state.syncState, isLoading: true, syncError: undefined }
				}))

				try {
					const result = await taskService.syncTasks()
					
					if (result.success && result.data) {
						const localTasks = result.data.map(convertFromSupabaseTask)
						
						set(state => ({
							tasks: localTasks,
							syncState: {
								...state.syncState,
								isLoading: false,
								lastSyncTime: result.lastSyncTime,
								hasPendingSync: false
							}
						}))
					} else {
						set(state => ({
							syncState: {
								...state.syncState,
								isLoading: false,
								syncError: result.error
							}
						}))
					}

					return {
						...result,
						data: result.data?.map(convertFromSupabaseTask)
					}
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Sync failed'
					
					set(state => ({
						syncState: {
							...state.syncState,
							isLoading: false,
							syncError: errorMessage
						}
					}))

					return { success: false, error: errorMessage }
				}
			},

			initializeSync: async () => {
				try {
					// Try to get remote tasks on app start
					const remoteTasks = await taskService.getAllTasks()
					const localTasks = remoteTasks.map(convertFromSupabaseTask)
					
					// Merge with existing local tasks if any
					const currentState = get()
					const mergedTasks = mergeTasks(currentState.tasks, localTasks)
					
					set(state => ({
						tasks: mergedTasks,
						syncState: {
							...state.syncState,
							isOnline: true,
							lastSyncTime: new Date().toISOString()
						}
					}))
				} catch (error) {
					console.warn('Failed to initialize sync:', error)
					set(state => ({
						syncState: {
							...state.syncState,
							isOnline: false
						}
					}))
				}
			},

			setSyncState: (updates: Partial<SyncState>) => {
				set(state => ({
					syncState: { ...state.syncState, ...updates }
				}))
			},

			// Migration methods
			startMigration: async () => {
				try {
					set(state => ({
						syncState: { ...state.syncState, isLoading: true }
					}))

					const result = await migrationService.migrateAllData({
						backupData: true,
						batchSize: 50
					})

					if (result.success) {
						// Refresh tasks after migration
						await get().initializeSync()
					} else {
						console.error('Migration failed:', result.errors)
						set(state => ({
							syncState: {
								...state.syncState,
								isLoading: false,
								syncError: 'Migration failed'
							}
						}))
					}
				} catch (error) {
					console.error('Migration error:', error)
					set(state => ({
						syncState: {
							...state.syncState,
							isLoading: false,
							syncError: 'Migration failed'
						}
					}))
				}
			},

			getMigrationStatus: () => {
				return migrationService.isMigrationInProgress()
			},

			cleanCompletedTasks: () =>
				set(state => {
					const today = dayjs().format('YYYY-MM-DD')

					return {
						tasks: state.tasks.filter(task => {
							if (!task.isCompleted) return true

							if (task.lastCompletedDate === today) {
								switch (task.repeat) {
									case 'Ежедневно':
										task.isCompleted = false
										task.lastCompletedDate = undefined
										return true
									case 'Еженедельно':
									case 'Ежемесячно':
									case 'Ежегодно':
										return true
									default:
										return false
								}
							}

							return true
						})
					}
				})
		}),
		{
			name: 'tasks-storage',
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)

let appStateSubscription: { remove: () => void } | null = null
let lastCleanupDate: string | null = null

const checkAndCleanTasks = () => {
	const today = dayjs().format('YYYY-MM-DD')
	
	// Only run cleanup once per day
	if (lastCleanupDate === today) {
		return
	}
	
	const { cleanCompletedTasks } = useTaskStore.getState()
	cleanCompletedTasks()
	lastCleanupDate = today
}

export const initTaskCleaning = () => {
	// Run initial cleanup
	checkAndCleanTasks()
	
	// Initialize sync on app start
	try {
		const { initializeSync } = useTaskStore.getState()
		initializeSync()
	} catch (error) {
		console.warn('Failed to initialize sync on app start:', error)
	}
	
	// Clean up existing subscription to prevent duplicates
	if (appStateSubscription) {
		appStateSubscription.remove()
	}
	
	// Create new subscription
	appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
		if (nextAppState === 'active') {
			// App became active, check if we need to clean tasks
			checkAndCleanTasks()
		}
	})
}

export const cleanupTaskCleaning = () => {
	if (appStateSubscription) {
		appStateSubscription.remove()
		appStateSubscription = null
	}
}