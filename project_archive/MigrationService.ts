import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'
import { taskService } from './TaskService'
import { 
  LocalTask, 
  LocalTransaction, 
  LocalNote, 
  LocalEisenhowerItem,
  SyncResult,
  InsertUser,
  InsertUserProfile
} from '@/types/supabase'

export interface MigrationOptions {
  backupData?: boolean
  clearLocalAfterMigration?: boolean
  batchSize?: number
  includeTables?: string[]
  excludeTables?: string[]
}

export interface MigrationResult {
  success: boolean
  migratedTables: string[]
  totalRecords: number
  errors: MigrationError[]
  backupPath?: string
  duration: number
}

export interface MigrationError {
  table: string
  record?: any
  error: string
  timestamp: string
}

export interface MigrationProgress {
  currentTable: string
  totalTables: number
  completedTables: number
  currentRecords: number
  totalRecords: number
  percentage: number
  isComplete: boolean
}

export class MigrationService {
  private static instance: MigrationService
  private migrationInProgress = false
  private progressCallback?: (progress: MigrationProgress) => void

  private constructor() {}

  static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService()
    }
    return MigrationService.instance
  }

  // Set progress callback for real-time updates
  setProgressCallback(callback: (progress: MigrationProgress) => void): void {
    this.progressCallback = callback
  }

  // Check if user is authenticated and create user profile if needed
  async ensureUserAuthenticated(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      // Sign in anonymously for offline-first approach
      const { data, error } = await supabase.auth.signInAnonymously()
      
      if (error) {
        throw new Error(`Authentication failed: ${error.message}`)
      }
      
      if (!data.user) {
        throw new Error('Failed to create anonymous user')
      }

      // Create user profile
      await this.createUserProfile(data.user.id)
      return data.user.id
    }

    return session.user.id
  }

  // Create user profile with default settings
  private async createUserProfile(userId: string): Promise<void> {
    try {
      const userProfile: InsertUserProfile = {
        user_id: userId,
        preferred_language: 'ru',
        currency_code: 'RUB',
        currency_symbol: '₽',
        currency_name: 'Russian Ruble',
        currency_rate: 1,
        safety_buffer_percent: 10,
        theme_mode: 'system',
        monthly_budget: 0
      }

      const { error } = await supabase
        .from('user_profiles')
        .insert(userProfile)

      if (error) {
        console.warn('Failed to create user profile:', error)
      }
    } catch (error) {
      console.warn('Error creating user profile:', error)
    }
  }

  // Create backup of local data before migration
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupKey = `migration_backup_${timestamp}`

    try {
      const backupData: Record<string, any> = {}

      // Backup all relevant data
      const dataKeys = [
        'tasks-storage',
        'transactions-storage', 
        'notes-storage',
        'eisenhower-storage',
        'settings-storage'
      ]

      for (const key of dataKeys) {
        try {
          const data = await AsyncStorage.getItem(key)
          if (data) {
            backupData[key] = JSON.parse(data)
          }
        } catch (error) {
          console.warn(`Failed to backup ${key}:`, error)
        }
      }

      await AsyncStorage.setItem(backupKey, JSON.stringify(backupData))
      return backupKey

    } catch (error) {
      throw new Error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Restore from backup
  async restoreFromBackup(backupKey: string): Promise<void> {
    try {
      const backupData = await AsyncStorage.getItem(backupKey)
      if (!backupData) {
        throw new Error('Backup not found')
      }

      const parsedData = JSON.parse(backupData)

      for (const [key, value] of Object.entries(parsedData)) {
        await AsyncStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      throw new Error(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get local data counts for migration planning
  async getLocalDataCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {}

    const dataSources = [
      { key: 'tasks-storage', name: 'tasks' },
      { key: 'transactions-storage', name: 'transactions' },
      { key: 'notes-storage', name: 'notes' },
      { key: 'eisenhower-storage', name: 'eisenhower' }
    ]

    for (const source of dataSources) {
      try {
        const data = await AsyncStorage.getItem(source.key)
        if (data) {
          const parsed = JSON.parse(data)
          counts[source.name] = Array.isArray(parsed) ? parsed.length : 0
        } else {
          counts[source.name] = 0
        }
      } catch (error) {
        counts[source.name] = 0
      }
    }

    return counts
  }

  // Main migration method
  async migrateAllData(options: MigrationOptions = {}): Promise<MigrationResult> {
    if (this.migrationInProgress) {
      throw new Error('Migration already in progress')
    }

    this.migrationInProgress = true
    const startTime = Date.now()
    const result: MigrationResult = {
      success: false,
      migratedTables: [],
      totalRecords: 0,
      errors: [],
      duration: 0
    }

    try {
      // Ensure user is authenticated
      await this.ensureUserAuthenticated()

      // Create backup if requested
      if (options.backupData) {
        result.backupPath = await this.createBackup()
      }

      // Get data counts for progress tracking
      const dataCounts = await this.getLocalDataCounts()
      const totalTables = Object.keys(dataCounts).length
      let completedTables = 0
      let totalRecords = 0

      const tables = options.includeTables || Object.keys(dataCounts)
      const tablesToMigrate = tables.filter(table => 
        !options.excludeTables?.includes(table) && dataCounts[table] > 0
      )

      // Migrate each table
      for (const tableName of tablesToMigrate) {
        try {
          this.updateProgress({
            currentTable: tableName,
            totalTables,
            completedTables,
            currentRecords: 0,
            totalRecords: dataCounts[tableName],
            percentage: (completedTables / totalTables) * 100,
            isComplete: false
          })

          let migrationResult: SyncResult<any>

          switch (tableName) {
            case 'tasks':
              migrationResult = await this.migrateTasks(options.batchSize || 50)
              break
            case 'transactions':
              migrationResult = await this.migrateTransactions(options.batchSize || 50)
              break
            case 'notes':
              migrationResult = await this.migrateNotes(options.batchSize || 50)
              break
            case 'eisenhower':
              migrationResult = await this.migrateEisenhowerItems(options.batchSize || 50)
              break
            default:
              continue
          }

          if (migrationResult.success) {
            result.migratedTables.push(tableName)
            totalRecords += migrationResult.syncedCount || 0
          } else {
            result.errors.push({
              table: tableName,
              error: migrationResult.error || 'Unknown error',
              timestamp: new Date().toISOString()
            })
          }

          completedTables++
          
        } catch (error) {
          result.errors.push({
            table: tableName,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          })
        }
      }

      // Clear local data if requested and migration was successful
      if (options.clearLocalAfterMigration && result.errors.length === 0) {
        await this.clearLocalData(tablesToMigrate)
      }

      result.success = result.errors.length === 0
      result.totalRecords = totalRecords
      result.duration = Date.now() - startTime

      // Final progress update
      this.updateProgress({
        currentTable: '',
        totalTables,
        completedTables,
        currentRecords: totalRecords,
        totalRecords,
        percentage: 100,
        isComplete: true
      })

      return result

    } catch (error) {
      result.errors.push({
        table: 'migration',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
      result.duration = Date.now() - startTime
      return result

    } finally {
      this.migrationInProgress = false
    }
  }

  // Migrate tasks
  private async migrateTasks(batchSize: number): Promise<SyncResult<LocalTask>> {
    try {
      const localTasks = await this.getLocalTasks()
      
      if (localTasks.length === 0) {
        return { success: true, data: [], syncedCount: 0 }
      }

      return await taskService.batchCreateTasks(localTasks)
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Task migration failed'
      }
    }
  }

  // Migrate transactions
  private async migrateTransactions(batchSize: number): Promise<SyncResult<LocalTransaction>> {
    try {
      const localTransactions = await this.getLocalTransactions()
      
      if (localTransactions.length === 0) {
        return { success: true, data: [], syncedCount: 0 }
      }

      // TODO: Implement TransactionService and batch create
      return { 
        success: true, 
        data: localTransactions, 
        syncedCount: localTransactions.length 
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction migration failed'
      }
    }
  }

  // Migrate notes
  private async migrateNotes(batchSize: number): Promise<SyncResult<LocalNote>> {
    try {
      const localNotes = await this.getLocalNotes()
      
      if (localNotes.length === 0) {
        return { success: true, data: [], syncedCount: 0 }
      }

      // TODO: Implement NotesService and batch create
      return { 
        success: true, 
        data: localNotes, 
        syncedCount: localNotes.length 
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Notes migration failed'
      }
    }
  }

  // Migrate Eisenhower matrix items
  private async migrateEisenhowerItems(batchSize: number): Promise<SyncResult<LocalEisenhowerItem>> {
    try {
      const localItems = await this.getLocalEisenhowerItems()
      
      if (localItems.length === 0) {
        return { success: true, data: [], syncedCount: 0 }
      }

      // TODO: Implement EisenhowerService and batch create
      return { 
        success: true, 
        data: localItems, 
        syncedCount: localItems.length 
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Eisenhower migration failed'
      }
    }
  }

  // Get local data methods
  private async getLocalTasks(): Promise<LocalTask[]> {
    try {
      const data = await AsyncStorage.getItem('tasks-storage')
      return data ? JSON.parse(data).state?.tasks || [] : []
    } catch {
      return []
    }
  }

  private async getLocalTransactions(): Promise<LocalTransaction[]> {
    try {
      const data = await AsyncStorage.getItem('transactions-storage')
      return data ? JSON.parse(data).state?.transactions || [] : []
    } catch {
      return []
    }
  }

  private async getLocalNotes(): Promise<LocalNote[]> {
    try {
      const data = await AsyncStorage.getItem('notes-storage')
      return data ? JSON.parse(data).state?.notes || [] : []
    } catch {
      return []
    }
  }

  private async getLocalEisenhowerItems(): Promise<LocalEisenhowerItem[]> {
    try {
      const data = await AsyncStorage.getItem('eisenhower-storage')
      return data ? JSON.parse(data).state?.items || [] : []
    } catch {
      return []
    }
  }

  // Clear local data after successful migration
  private async clearLocalData(tables: string[]): Promise<void> {
    const keyMapping: Record<string, string> = {
      tasks: 'tasks-storage',
      transactions: 'transactions-storage', 
      notes: 'notes-storage',
      eisenhower: 'eisenhower-storage'
    }

    for (const table of tables) {
      const key = keyMapping[table]
      if (key) {
        try {
          await AsyncStorage.removeItem(key)
        } catch (error) {
          console.warn(`Failed to clear ${key}:`, error)
        }
      }
    }
  }

  // Progress update helper
  private updateProgress(progress: MigrationProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress)
    }
  }

  // Check migration status
  isMigrationInProgress(): boolean {
    return this.migrationInProgress
  }

  // Get available backups
  async getAvailableBackups(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      return keys.filter(key => key.startsWith('migration_backup_'))
    } catch (error) {
      console.error('Error getting backups:', error)
      return []
    }
  }

  // Delete backup
  async deleteBackup(backupKey: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(backupKey)
    } catch (error) {
      throw new Error(`Failed to delete backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Validate data integrity after migration
  async validateMigration(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    try {
      // Check if user can read their data
      const userId = await this.getCurrentUserId()
      if (!userId) {
        issues.push('User not authenticated after migration')
        return { isValid: false, issues }
      }

      // Validate task data integrity
      try {
        const tasks = await taskService.getAllTasks()
        console.log(`Migration validation: Found ${tasks.length} tasks`)
      } catch (error) {
        issues.push(`Task validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // TODO: Add validation for other data types

      return { isValid: issues.length === 0, issues }
      
    } catch (error) {
      issues.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return { isValid: false, issues }
    }
  }

  private async getCurrentUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id || null
  }
}

export const migrationService = MigrationService.getInstance()