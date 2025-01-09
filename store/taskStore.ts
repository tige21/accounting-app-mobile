import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'

interface Task {
	id: string
	title: string
	date: string
	time: string
	repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
	reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
	comment?: string
	isCompleted?: boolean
	lastCompletedDate?: string
}

interface TaskStore {
	tasks: Task[]
	addTask: (task: Task) => void
	deleteTask: (taskId: string) => void
	updateTask: (taskId: string, updates: Partial<Task>) => void
	cleanCompletedTasks: () => void
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

export const initTaskCleaning = () => {
	const checkAndCleanTasks = () => {
		const { cleanCompletedTasks } = useTaskStore.getState()
		cleanCompletedTasks()
	}

	checkAndCleanTasks()

	setInterval(() => {
		const now = new Date()
		if (now.getHours() === 0 && now.getMinutes() === 0) {
			checkAndCleanTasks()
		}
	}, 60000)
}
