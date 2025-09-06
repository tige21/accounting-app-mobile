import { BaseService } from './BaseService'
import { supabase } from '@/lib/supabase'
import { 
  DbTask, 
  InsertTask, 
  UpdateTask, 
  LocalTask, 
  SyncResult, 
  SyncOptions,
  OfflineAction 
} from '@/types/supabase'

export class TaskService extends BaseService {
  constructor() {
    super('tasks')
  }

  // Transform between local and database formats
  private transformToDb(localTask: LocalTask, userId: string): InsertTask {
    return {
      id: localTask.id,
      user_id: userId,
      title: localTask.title,
      date: localTask.date,
      time: localTask.time,
      comment: localTask.comment || '',
      repeat_type: this.mapRepeatType(localTask.repeat),
      reminder_type: this.mapReminderType(localTask.reminder),
      is_completed: localTask.isCompleted || false,
      last_completed_date: localTask.lastCompletedDate || null,
      notification_time: localTask.notificationTime || null,
      notification_id: localTask.notificationId || null,
      synced_at: this.getCurrentTimestamp()
    }
  }

  private transformToLocal(dbTask: DbTask): LocalTask {
    return {
      id: dbTask.id,
      title: dbTask.title,
      date: dbTask.date,
      time: dbTask.time,
      repeat: this.mapDbRepeatType(dbTask.repeat_type),
      reminder: this.mapDbReminderType(dbTask.reminder_type),
      comment: dbTask.comment,
      isCompleted: dbTask.is_completed,
      lastCompletedDate: dbTask.last_completed_date || undefined,
      notificationTime: dbTask.notification_time || undefined,
      notificationId: dbTask.notification_id || undefined
    }
  }

  private mapRepeatType(repeat: LocalTask['repeat']): string {
    const mapping = {
      'Никогда': 'never',
      'Ежедневно': 'daily',
      'Еженедельно': 'weekly',
      'Ежемесячно': 'monthly',
      'Ежегодно': 'yearly'
    }
    return mapping[repeat] || 'never'
  }

  private mapDbRepeatType(repeat: string): LocalTask['repeat'] {
    const mapping = {
      'never': 'Никогда',
      'daily': 'Ежедневно',
      'weekly': 'Еженедельно',
      'monthly': 'Ежемесячно',
      'yearly': 'Ежегодно'
    }
    return mapping[repeat] as LocalTask['repeat'] || 'Никогда'
  }

  private mapReminderType(reminder: LocalTask['reminder']): string {
    const mapping = {
      'Нет': 'none',
      'За 5 минут': '5min',
      'За 15 минут': '15min',
      'За 1 час': '1hour',
      'За 1 день': '1day',
      'За 1 неделю': '1week'
    }
    return mapping[reminder] || 'none'
  }

  private mapDbReminderType(reminder: string): LocalTask['reminder'] {
    const mapping = {
      'none': 'Нет',
      '5min': 'За 5 минут',
      '15min': 'За 15 минут',
      '1hour': 'За 1 час',
      '1day': 'За 1 день',
      '1week': 'За 1 неделю'
    }
    return mapping[reminder] as LocalTask['reminder'] || 'Нет'
  }

  // CRUD Operations
  async createTask(task: LocalTask): Promise<LocalTask> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      await this.addToOfflineQueue({
        type: 'CREATE',
        table: this.tableName,
        data: task,
        maxRetries: 3
      })
      return task
    }

    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      await this.addToOfflineQueue({
        type: 'CREATE',
        table: this.tableName,
        data: task,
        maxRetries: 3
      })
      return task
    }

    try {
      this.validateRequiredFields(task, ['id', 'title', 'date', 'time'])
      
      const dbTask = this.transformToDb(task, userId)
      const { data, error } = await supabase
        .from('tasks')
        .insert(dbTask)
        .select()
        .single()

      if (error) {
        this.handleError(error, 'Create task')
      }

      return this.transformToLocal(data)
    } catch (error) {
      await this.addToOfflineQueue({
        type: 'CREATE',
        table: this.tableName,
        data: task,
        maxRetries: 3
      })
      throw error
    }
  }

  async updateTask(taskId: string, updates: Partial<LocalTask>): Promise<LocalTask> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      await this.addToOfflineQueue({
        type: 'UPDATE',
        table: this.tableName,
        data: { id: taskId, ...updates },
        maxRetries: 3
      })
      throw new Error('User not authenticated')
    }

    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      await this.addToOfflineQueue({
        type: 'UPDATE',
        table: this.tableName,
        data: { id: taskId, ...updates },
        maxRetries: 3
      })
      throw new Error('No connection to server')
    }

    try {
      const updateData: UpdateTask = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.date !== undefined) updateData.date = updates.date
      if (updates.time !== undefined) updateData.time = updates.time
      if (updates.comment !== undefined) updateData.comment = updates.comment
      if (updates.repeat !== undefined) updateData.repeat_type = this.mapRepeatType(updates.repeat)
      if (updates.reminder !== undefined) updateData.reminder_type = this.mapReminderType(updates.reminder)
      if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted
      if (updates.lastCompletedDate !== undefined) updateData.last_completed_date = updates.lastCompletedDate
      if (updates.notificationTime !== undefined) updateData.notification_time = updates.notificationTime
      if (updates.notificationId !== undefined) updateData.notification_id = updates.notificationId
      
      updateData.updated_at = this.getCurrentTimestamp()
      updateData.synced_at = this.getCurrentTimestamp()

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        this.handleError(error, 'Update task')
      }

      return this.transformToLocal(data)
    } catch (error) {
      await this.addToOfflineQueue({
        type: 'UPDATE',
        table: this.tableName,
        data: { id: taskId, ...updates },
        maxRetries: 3
      })
      throw error
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      await this.addToOfflineQueue({
        type: 'DELETE',
        table: this.tableName,
        data: { id: taskId },
        maxRetries: 3
      })
      return
    }

    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      await this.addToOfflineQueue({
        type: 'DELETE',
        table: this.tableName,
        data: { id: taskId },
        maxRetries: 3
      })
      return
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId)

      if (error) {
        this.handleError(error, 'Delete task')
      }
    } catch (error) {
      await this.addToOfflineQueue({
        type: 'DELETE',
        table: this.tableName,
        data: { id: taskId },
        maxRetries: 3
      })
      throw error
    }
  }

  async getTask(taskId: string): Promise<LocalTask | null> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      // Return from local storage if offline
      const localTasks = await this.getLocalData<LocalTask>()
      return localTasks.find(task => task.id === taskId) || null
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select()
        .eq('id', taskId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Task not found
        }
        this.handleError(error, 'Get task')
      }

      return this.transformToLocal(data)
    } catch (error) {
      throw error
    }
  }

  async getAllTasks(): Promise<LocalTask[]> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      // Return local tasks if not authenticated
      return await this.getLocalData<LocalTask>()
    }

    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      return await this.getLocalData<LocalTask>()
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        this.handleError(error, 'Get all tasks')
      }

      const localTasks = data.map(task => this.transformToLocal(task))
      
      // Update local cache
      await this.setLocalData(localTasks)
      
      return localTasks
    } catch (error) {
      // Return cached data on error
      return await this.getLocalData<LocalTask>()
    }
  }

  // Sync operations
  async syncTasks(options: SyncOptions = {}): Promise<SyncResult<LocalTask>> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      return {
        success: false,
        error: 'No connection to server'
      }
    }

    try {
      const lastSyncTime = options.forceSync ? null : await this.getLastSyncTime()
      const currentTime = this.getCurrentTimestamp()

      // Get remote changes since last sync
      let query = supabase
        .from('tasks')
        .select()
        .eq('user_id', userId)

      if (lastSyncTime && !options.forceSync) {
        query = query.gt('synced_at', lastSyncTime)
      }

      const { data: remoteData, error } = await query.order('synced_at', { ascending: true })

      if (error) {
        this.handleError(error, 'Sync tasks')
      }

      const remoteTasks = remoteData.map(task => this.transformToLocal(task))

      // Process offline queue
      await this.processOfflineQueue()

      // Update local cache
      const localTasks = await this.getLocalData<LocalTask>()
      const mergedTasks = this.mergeTasks(localTasks, remoteTasks)
      await this.setLocalData(mergedTasks)

      // Update last sync time
      await this.setLastSyncTime(currentTime)

      return {
        success: true,
        data: mergedTasks,
        syncedCount: remoteTasks.length,
        lastSyncTime: currentTime
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown sync error'
      }
    }
  }

  private mergeTasks(localTasks: LocalTask[], remoteTasks: LocalTask[]): LocalTask[] {
    const mergedMap = new Map<string, LocalTask>()

    // Add all local tasks
    localTasks.forEach(task => {
      mergedMap.set(task.id, task)
    })

    // Merge remote tasks (remote takes precedence for conflicts)
    remoteTasks.forEach(remoteTask => {
      mergedMap.set(remoteTask.id, remoteTask)
    })

    return Array.from(mergedMap.values())
  }

  // Offline queue execution
  protected async executeOfflineAction(action: OfflineAction): Promise<void> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    switch (action.type) {
      case 'CREATE':
        const createData = this.transformToDb(action.data as LocalTask, userId)
        const { error: createError } = await supabase
          .from('tasks')
          .insert(createData)
        
        if (createError) {
          throw createError
        }
        break

      case 'UPDATE':
        const { id, ...updateFields } = action.data
        const updateData: UpdateTask = {}
        
        // Map update fields
        if (updateFields.title !== undefined) updateData.title = updateFields.title
        if (updateFields.date !== undefined) updateData.date = updateFields.date
        if (updateFields.time !== undefined) updateData.time = updateFields.time
        if (updateFields.comment !== undefined) updateData.comment = updateFields.comment
        if (updateFields.repeat !== undefined) updateData.repeat_type = this.mapRepeatType(updateFields.repeat)
        if (updateFields.reminder !== undefined) updateData.reminder_type = this.mapReminderType(updateFields.reminder)
        if (updateFields.isCompleted !== undefined) updateData.is_completed = updateFields.isCompleted
        if (updateFields.lastCompletedDate !== undefined) updateData.last_completed_date = updateFields.lastCompletedDate
        if (updateFields.notificationTime !== undefined) updateData.notification_time = updateFields.notificationTime
        if (updateFields.notificationId !== undefined) updateData.notification_id = updateFields.notificationId
        
        updateData.updated_at = this.getCurrentTimestamp()
        updateData.synced_at = this.getCurrentTimestamp()

        const { error: updateError } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', userId)
        
        if (updateError) {
          throw updateError
        }
        break

      case 'DELETE':
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', action.data.id)
          .eq('user_id', userId)
        
        if (deleteError) {
          throw deleteError
        }
        break

      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }

  // Batch operations
  async batchCreateTasks(tasks: LocalTask[]): Promise<SyncResult<LocalTask>> {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      // Add all to offline queue
      for (const task of tasks) {
        await this.addToOfflineQueue({
          type: 'CREATE',
          table: this.tableName,
          data: task,
          maxRetries: 3
        })
      }
      
      return {
        success: true,
        data: tasks,
        syncedCount: tasks.length
      }
    }

    try {
      const dbTasks = tasks.map(task => this.transformToDb(task, userId))
      
      const results = await this.processBatch(
        dbTasks,
        async (batch) => {
          const { data, error } = await supabase
            .from('tasks')
            .insert(batch)
            .select()
          
          if (error) {
            throw error
          }
          
          return data
        },
        50
      )

      const createdTasks = results.map(task => this.transformToLocal(task))
      
      return {
        success: true,
        data: createdTasks,
        syncedCount: createdTasks.length
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Batch create failed'
      }
    }
  }
}

export const taskService = new TaskService()