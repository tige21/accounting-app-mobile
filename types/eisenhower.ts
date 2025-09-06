export enum EisenhowerQuadrant {
  DO_FIRST = 'do_first',          // Срочно и важно
  SCHEDULE = 'schedule',          // Важно, не срочно
  DELEGATE = 'delegate',          // Срочно, не важно
  ELIMINATE = 'eliminate'         // Не срочно и не важно
}

export interface EisenhowerItem {
  id: string
  title: string
  description?: string
  urgency: 1 | 2 | 3 | 4 | 5      // 1=низкая, 5=высокая
  importance: 1 | 2 | 3 | 4 | 5    // 1=низкая, 5=высокая
  quadrant: EisenhowerQuadrant
  taskId?: string                   // Связь с существующей задачей
  noteId?: string                   // Связь с существующей заметкой
  createdAt: string
  updatedAt: string
  completedAt?: string
  estimatedDuration?: number        // в минутах
  tags?: string[]
  priority: number                  // Автоматически рассчитывается
  color?: string
  isCompleted?: boolean
}

export interface EisenhowerQuadrantConfig {
  type: EisenhowerQuadrant
  title: string
  subtitle: string
  color: string
  backgroundColor: string
  borderColor: string
  description: string
}

export interface MatrixStats {
  totalItems: number
  completedItems: number
  itemsByQuadrant: {
    [key in EisenhowerQuadrant]: number
  }
  averagePriority: number
  completionRate: number
}

export interface DragState {
  isDragging: boolean
  draggedItem: EisenhowerItem | null
  sourceQuadrant: EisenhowerQuadrant | null
  targetQuadrant: EisenhowerQuadrant | null
}