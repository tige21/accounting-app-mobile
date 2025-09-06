import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ConnectionState, OfflineAction, SyncOptions, SyncResult } from '@/types/supabase'

export abstract class BaseService {
  protected tableName: string
  protected storageKey: string

  constructor(tableName: string) {
    this.tableName = tableName
    this.storageKey = `offline_${tableName}`
  }

  // Connection management
  protected async checkConnection(): Promise<ConnectionState> {
    try {
      const startTime = Date.now()
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1)
        .maybeSingle()

      const endTime = Date.now()
      
      return {
        isOnline: true,
        isConnectedToSupabase: !error,
        lastPingTime: new Date(),
        networkType: 'unknown'
      }
    } catch (error) {
      return {
        isOnline: false,
        isConnectedToSupabase: false,
        lastPingTime: new Date()
      }
    }
  }

  // Get current user ID from session
  protected async getCurrentUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id || null
  }

  // Local storage helpers
  protected async getLocalData<T>(key?: string): Promise<T[]> {
    try {
      const storageKey = key || this.storageKey
      const data = await AsyncStorage.getItem(storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Error getting local data for ${this.storageKey}:`, error)
      return []
    }
  }

  protected async setLocalData<T>(data: T[], key?: string): Promise<void> {
    try {
      const storageKey = key || this.storageKey
      await AsyncStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.error(`Error setting local data for ${this.storageKey}:`, error)
    }
  }

  // Offline queue management
  protected async addToOfflineQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    try {
      const queueKey = `offline_queue_${this.tableName}`
      const existingQueue = await this.getLocalData<OfflineAction>(queueKey)
      
      const newAction: OfflineAction = {
        ...action,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        retries: 0
      }

      existingQueue.push(newAction)
      await this.setLocalData(existingQueue, queueKey)
    } catch (error) {
      console.error('Error adding to offline queue:', error)
    }
  }

  protected async processOfflineQueue(): Promise<void> {
    const connectionState = await this.checkConnection()
    
    if (!connectionState.isConnectedToSupabase) {
      return
    }

    try {
      const queueKey = `offline_queue_${this.tableName}`
      const queue = await this.getLocalData<OfflineAction>(queueKey)
      const processedActions: string[] = []

      for (const action of queue) {
        try {
          await this.executeOfflineAction(action)
          processedActions.push(action.id)
        } catch (error) {
          console.error(`Error processing offline action ${action.id}:`, error)
          
          action.retries++
          if (action.retries >= action.maxRetries) {
            processedActions.push(action.id)
            console.warn(`Max retries reached for action ${action.id}, removing from queue`)
          }
        }
      }

      // Remove processed actions from queue
      const remainingQueue = queue.filter(action => !processedActions.includes(action.id))
      await this.setLocalData(remainingQueue, queueKey)
    } catch (error) {
      console.error('Error processing offline queue:', error)
    }
  }

  protected abstract executeOfflineAction(action: OfflineAction): Promise<void>

  // Sync helpers
  protected async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`last_sync_${this.tableName}`)
    } catch (error) {
      console.error('Error getting last sync time:', error)
      return null
    }
  }

  protected async setLastSyncTime(time: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`last_sync_${this.tableName}`, time)
    } catch (error) {
      console.error('Error setting last sync time:', error)
    }
  }

  // Timestamp helpers
  protected getCurrentTimestamp(): string {
    return new Date().toISOString()
  }

  // Error handling
  protected handleError(error: any, operation: string): never {
    console.error(`${operation} error in ${this.tableName}:`, error)
    throw new Error(`${operation} failed: ${error.message || error}`)
  }

  // Batch processing
  protected async processBatch<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    batchSize: number = 50
  ): Promise<R[]> {
    const results: R[] = []
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const batchResults = await processor(batch)
      results.push(...batchResults)
    }
    
    return results
  }

  // Data validation
  protected validateRequiredFields<T extends Record<string, any>>(
    data: T,
    requiredFields: (keyof T)[]
  ): void {
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new Error(`Required field '${String(field)}' is missing or empty`)
      }
    }
  }
}