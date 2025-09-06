import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EisenhowerItem, EisenhowerQuadrant, MatrixStats, EisenhowerQuadrantConfig } from '@/types/eisenhower'

interface EisenhowerStore {
  items: EisenhowerItem[]
  addItem: (item: Omit<EisenhowerItem, 'id' | 'createdAt' | 'updatedAt' | 'priority'>) => void
  updateItem: (id: string, updates: Partial<EisenhowerItem>) => void
  deleteItem: (id: string) => void
  moveItem: (id: string, newQuadrant: EisenhowerQuadrant) => void
  getItemsByQuadrant: (quadrant: EisenhowerQuadrant) => EisenhowerItem[]
  calculatePriority: (urgency: number, importance: number) => number
  determineQuadrant: (urgency: number, importance: number) => EisenhowerQuadrant
  getMatrixStats: () => MatrixStats
  syncWithTasks: () => void
  syncWithNotes: () => void
  syncToTasks: (item: EisenhowerItem) => void
  syncToNotes: (item: EisenhowerItem) => void
  clearMatrix: () => void
}

export const QUADRANT_CONFIGS: Record<EisenhowerQuadrant, EisenhowerQuadrantConfig> = {
  [EisenhowerQuadrant.DO_FIRST]: {
    type: EisenhowerQuadrant.DO_FIRST,
    title: 'Делать',
    subtitle: 'Срочно и важно',
    color: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: '#FF3B30',
    description: 'Критические задачи, требующие немедленного внимания'
  },
  [EisenhowerQuadrant.SCHEDULE]: {
    type: EisenhowerQuadrant.SCHEDULE,
    title: 'Планировать',
    subtitle: 'Важно, не срочно',
    color: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
    description: 'Важные задачи для долгосрочного планирования'
  },
  [EisenhowerQuadrant.DELEGATE]: {
    type: EisenhowerQuadrant.DELEGATE,
    title: 'Делегировать',
    subtitle: 'Срочно, не важно',
    color: '#FF9500',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderColor: '#FF9500',
    description: 'Срочные задачи, которые можно передать другим'
  },
  [EisenhowerQuadrant.ELIMINATE]: {
    type: EisenhowerQuadrant.ELIMINATE,
    title: 'Исключить',
    subtitle: 'Не срочно, не важно',
    color: '#8E8E93',
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    borderColor: '#C7C7CC',
    description: 'Задачи низкой важности, от которых можно отказаться'
  }
}

export const useEisenhowerStore = create<EisenhowerStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const store = get()
        const priority = store.calculatePriority(item.urgency, item.importance)
        const quadrant = store.determineQuadrant(item.urgency, item.importance)
        
        set((state) => ({
          items: [
            {
              ...item,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              priority,
              quadrant: item.quadrant || quadrant,
              isCompleted: false,
            },
            ...state.items,
          ],
        }))
      },

      updateItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item => {
            if (item.id === id) {
              const updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() }
              
              // Пересчитать приоритет если изменились срочность или важность
              if (updates.urgency !== undefined || updates.importance !== undefined) {
                const store = get()
                updatedItem.priority = store.calculatePriority(
                  updates.urgency ?? item.urgency,
                  updates.importance ?? item.importance
                )
              }
              
              return updatedItem
            }
            return item
          })
        }))
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      moveItem: (id, newQuadrant) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quadrant: newQuadrant, updatedAt: new Date().toISOString() }
              : item
          )
        }))
      },

      getItemsByQuadrant: (quadrant) => {
        return get().items
          .filter(item => item.quadrant === quadrant && !item.isCompleted)
          .sort((a, b) => b.priority - a.priority)
      },

      calculatePriority: (urgency, importance) => {
        // Формула: важность имеет больший вес чем срочность
        return (importance * 2) + urgency
      },

      determineQuadrant: (urgency: number, importance: number): EisenhowerQuadrant => {
        const isUrgent = urgency >= 4
        const isImportant = importance >= 4

        if (isUrgent && isImportant) return EisenhowerQuadrant.DO_FIRST
        if (!isUrgent && isImportant) return EisenhowerQuadrant.SCHEDULE
        if (isUrgent && !isImportant) return EisenhowerQuadrant.DELEGATE
        return EisenhowerQuadrant.ELIMINATE
      },

      getMatrixStats: () => {
        const items = get().items
        const totalItems = items.length
        const completedItems = items.filter(item => item.isCompleted).length
        
        const itemsByQuadrant = {
          [EisenhowerQuadrant.DO_FIRST]: items.filter(item => item.quadrant === EisenhowerQuadrant.DO_FIRST).length,
          [EisenhowerQuadrant.SCHEDULE]: items.filter(item => item.quadrant === EisenhowerQuadrant.SCHEDULE).length,
          [EisenhowerQuadrant.DELEGATE]: items.filter(item => item.quadrant === EisenhowerQuadrant.DELEGATE).length,
          [EisenhowerQuadrant.ELIMINATE]: items.filter(item => item.quadrant === EisenhowerQuadrant.ELIMINATE).length,
        }

        const averagePriority = totalItems > 0
          ? items.reduce((sum, item) => sum + item.priority, 0) / totalItems
          : 0

        const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

        return {
          totalItems,
          completedItems,
          itemsByQuadrant,
          averagePriority,
          completionRate,
        }
      },

      syncWithTasks: () => {
        // Импортируем только внутри функции чтобы избежать циклических зависимостей
        const { useTaskStore } = require('./taskStore')
        const { tasks } = useTaskStore.getState()
        const { items, addItem, updateItem } = get()

        tasks.forEach((task: any) => {
          // Проверяем есть ли уже элемент матрицы для этой задачи
          const existingItem = items.find(item => item.taskId === task.id)
          
          if (!existingItem && task.title) {
            // Создаем новый элемент матрицы на основе задачи
            const urgency = task.reminder !== 'Нет' ? 4 : 2 // Срочно если есть уведомление
            const importance = 3 // Средняя важность по умолчанию
            
            addItem({
              title: task.title,
              description: task.comment,
              urgency,
              importance,
              taskId: task.id,
              quadrant: get().determineQuadrant(urgency, importance),
              isCompleted: task.isCompleted
            })
          } else if (existingItem) {
            // Обновляем существующий элемент если задача изменилась
            updateItem(existingItem.id, {
              title: task.title,
              description: task.comment,
              isCompleted: task.isCompleted
            })
          }
        })
      },

      syncWithNotes: () => {
        // Импортируем только внутри функции чтобы избежать циклических зависимостей
        const { useNoteStore } = require('./noteStore')
        const { notes } = useNoteStore.getState()
        const { items, addItem, updateItem } = get()

        notes.forEach((note: any) => {
          // Проверяем есть ли уже элемент матрицы для этой заметки
          const existingItem = items.find(item => item.noteId === note.id)
          
          if (!existingItem && note.title) {
            // Создаем новый элемент матрицы на основе заметки
            const urgency = 2 // Заметки обычно не срочны
            const importance = note.tags && note.tags.includes('важно') ? 4 : 2
            
            addItem({
              title: note.title,
              description: note.content?.slice(0, 100), // Первые 100 символов как описание
              urgency,
              importance,
              noteId: note.id,
              quadrant: get().determineQuadrant(urgency, importance),
              tags: note.tags,
              isCompleted: note.isCompleted
            })
          } else if (existingItem) {
            // Обновляем существующий элемент если заметка изменилась
            updateItem(existingItem.id, {
              title: note.title,
              description: note.content?.slice(0, 100),
              tags: note.tags,
              isCompleted: note.isCompleted
            })
          }
        })
      },

      syncToTasks: (item: EisenhowerItem) => {
        if (!item.taskId) return
        
        const { useTaskStore } = require('./taskStore')
        const { updateTask } = useTaskStore.getState()
        
        updateTask(item.taskId, {
          title: item.title,
          comment: item.description,
          isCompleted: item.isCompleted
        })
      },

      syncToNotes: (item: EisenhowerItem) => {
        if (!item.noteId) return
        
        const { useNoteStore } = require('./noteStore')
        const { updateNote } = useNoteStore.getState()
        
        updateNote(item.noteId, {
          title: item.title,
          content: item.description || '',
          tags: item.tags,
          isCompleted: item.isCompleted
        })
      },

      clearMatrix: () => set({ items: [] }),
    }),
    {
      name: 'eisenhower-matrix-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)