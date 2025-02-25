export interface Task {
  id: string
  title: string
  date: string
  time: string
  repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
  reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
  comment: string
  isCompleted: boolean
  notificationTime?: string
  notificationId?: string
}

export interface TaskParams {
  id: string
  title: string
  date: string
  time: string
  repeat: Task['repeat']
  reminder: string
  comment: string
  isCompleted: string
  notificationTime?: string
  notificationId?: string
} 