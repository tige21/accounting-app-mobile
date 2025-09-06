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

export const useTaskStore = create<TaskStore>()(
	persist(
		set => ({
			tasks: [],

			addTask: task =>
				set(state => ({
					tasks: [...state.tasks, task]
				})),

			deleteTask: taskId =>
				set(state => ({
					tasks: state.tasks.filter(task => task.id !== taskId)
				})),

			updateTask: (taskId, updates) =>
				set(state => ({
					tasks: state.tasks.map(task =>
						task.id === taskId
							? {
									...task,
									...updates,
									lastCompletedDate: updates.isCompleted
										? dayjs().format('YYYY-MM-DD')
										: task.lastCompletedDate
							  }
							: task
					)
				})),

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
