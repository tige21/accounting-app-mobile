export interface TodoItem {
  id: string
  text: string
  isCompleted: boolean
  notificationTime?: string // время уведомления HH:mm
  notificationDate?: string // дата уведомления ISO string
  notificationId?: string // id уведомления
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  isCompleted?: boolean
  tags?: string[]
  notebookId?: string
  todos?: TodoItem[]
}

export interface Notebook {
  id: string
  title: string
  createdAt: string
  notes: Note[]
} 