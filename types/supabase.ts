// Generated TypeScript types for Supabase Database
// This file contains type definitions for the WalletWatch database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          created_at: string
          updated_at: string
          last_seen: string
          metadata: Json
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string
          updated_at?: string
          last_seen?: string
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string
          updated_at?: string
          last_seen?: string
          metadata?: Json
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          preferred_language: string
          currency_code: string
          currency_symbol: string
          currency_name: string
          currency_rate: number
          safety_buffer_percent: number
          theme_mode: string
          monthly_budget: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          preferred_language?: string
          currency_code?: string
          currency_symbol?: string
          currency_name?: string
          currency_rate?: number
          safety_buffer_percent?: number
          theme_mode?: string
          monthly_budget?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          preferred_language?: string
          currency_code?: string
          currency_symbol?: string
          currency_name?: string
          currency_rate?: number
          safety_buffer_percent?: number
          theme_mode?: string
          monthly_budget?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          time: string
          comment: string
          repeat_type: string
          reminder_type: string
          is_completed: boolean
          last_completed_date: string | null
          notification_time: string | null
          notification_id: string | null
          created_at: string
          updated_at: string
          synced_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          date: string
          time: string
          comment?: string
          repeat_type?: string
          reminder_type?: string
          is_completed?: boolean
          last_completed_date?: string | null
          notification_time?: string | null
          notification_id?: string | null
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          time?: string
          comment?: string
          repeat_type?: string
          reminder_type?: string
          is_completed?: boolean
          last_completed_date?: string | null
          notification_time?: string | null
          notification_id?: string | null
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category: string
          price: number
          color: string
          type: 'income' | 'expense'
          date: string
          description: string
          created_at: string
          updated_at: string
          synced_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          price: number
          color: string
          type: 'income' | 'expense'
          date: string
          description?: string
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          price?: number
          color?: string
          type?: 'income' | 'expense'
          date?: string
          description?: string
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notebooks: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notebooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          id: string
          user_id: string
          notebook_id: string | null
          title: string
          content: string
          is_completed: boolean
          tags: string[]
          created_at: string
          updated_at: string
          synced_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notebook_id?: string | null
          title: string
          content?: string
          is_completed?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notebook_id?: string | null
          title?: string
          content?: string
          is_completed?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      todo_items: {
        Row: {
          id: string
          note_id: string
          text: string
          is_completed: boolean
          notification_time: string | null
          notification_date: string | null
          notification_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          note_id: string
          text: string
          is_completed?: boolean
          notification_time?: string | null
          notification_date?: string | null
          notification_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          text?: string
          is_completed?: boolean
          notification_time?: string | null
          notification_date?: string | null
          notification_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_items_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          }
        ]
      }
      eisenhower_items: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          note_id: string | null
          title: string
          description: string
          urgency: number
          importance: number
          quadrant: 'do_first' | 'schedule' | 'delegate' | 'eliminate'
          priority: number
          estimated_duration: number | null
          tags: string[]
          color: string | null
          is_completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
          synced_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          note_id?: string | null
          title: string
          description?: string
          urgency: number
          importance: number
          quadrant: 'do_first' | 'schedule' | 'delegate' | 'eliminate'
          priority: number
          estimated_duration?: number | null
          tags?: string[]
          color?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          note_id?: string | null
          title?: string
          description?: string
          urgency?: number
          importance?: number
          quadrant?: 'do_first' | 'schedule' | 'delegate' | 'eliminate'
          priority?: number
          estimated_duration?: number | null
          tags?: string[]
          color?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eisenhower_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eisenhower_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eisenhower_items_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          }
        ]
      }
      user_sync_state: {
        Row: {
          user_id: string
          last_sync: string
          sync_version: number
          updated_at: string
        }
        Insert: {
          user_id: string
          last_sync?: string
          sync_version?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          last_sync?: string
          sync_version?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sync_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          table_name: string
          record_id: string | null
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          old_values: Json | null
          new_values: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          table_name: string
          record_id?: string | null
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          table_name?: string
          record_id?: string | null
          action?: 'INSERT' | 'UPDATE' | 'DELETE'
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_eisenhower_priority: {
        Args: {
          urgency: number
          importance: number
        }
        Returns: number
      }
      determine_eisenhower_quadrant: {
        Args: {
          urgency: number
          importance: number
        }
        Returns: string
      }
      user_owns_task: {
        Args: {
          task_uuid: string
        }
        Returns: boolean
      }
      user_owns_note: {
        Args: {
          note_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use throughout the application
export type DbUser = Database['public']['Tables']['users']['Row']
export type DbUserProfile = Database['public']['Tables']['user_profiles']['Row']
export type DbTask = Database['public']['Tables']['tasks']['Row']
export type DbTransaction = Database['public']['Tables']['transactions']['Row']
export type DbNotebook = Database['public']['Tables']['notebooks']['Row']
export type DbNote = Database['public']['Tables']['notes']['Row']
export type DbTodoItem = Database['public']['Tables']['todo_items']['Row']
export type DbEisenhowerItem = Database['public']['Tables']['eisenhower_items']['Row']
export type DbSyncState = Database['public']['Tables']['user_sync_state']['Row']
export type DbAuditLog = Database['public']['Tables']['audit_log']['Row']

// Insert types
export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertUserProfile = Database['public']['Tables']['user_profiles']['Insert']
export type InsertTask = Database['public']['Tables']['tasks']['Insert']
export type InsertTransaction = Database['public']['Tables']['transactions']['Insert']
export type InsertNotebook = Database['public']['Tables']['notebooks']['Insert']
export type InsertNote = Database['public']['Tables']['notes']['Insert']
export type InsertTodoItem = Database['public']['Tables']['todo_items']['Insert']
export type InsertEisenhowerItem = Database['public']['Tables']['eisenhower_items']['Insert']

// Update types
export type UpdateUser = Database['public']['Tables']['users']['Update']
export type UpdateUserProfile = Database['public']['Tables']['user_profiles']['Update']
export type UpdateTask = Database['public']['Tables']['tasks']['Update']
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update']
export type UpdateNotebook = Database['public']['Tables']['notebooks']['Update']
export type UpdateNote = Database['public']['Tables']['notes']['Update']
export type UpdateTodoItem = Database['public']['Tables']['todo_items']['Update']
export type UpdateEisenhowerItem = Database['public']['Tables']['eisenhower_items']['Update']

// Application-specific types that bridge the gap between local and remote types
export interface LocalTask {
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

export interface LocalTransaction {
  id: string
  category: string
  price: number
  color: string
  type: 'income' | 'expense'
  date: Date
  description: string
}

export interface LocalNote {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  isCompleted?: boolean
  tags?: string[]
  notebookId?: string
  todos?: LocalTodoItem[]
}

export interface LocalTodoItem {
  id: string
  text: string
  isCompleted: boolean
  notificationTime?: string
  notificationDate?: string
  notificationId?: string
}

export interface LocalEisenhowerItem {
  id: string
  title: string
  description?: string
  urgency: 1 | 2 | 3 | 4 | 5
  importance: 1 | 2 | 3 | 4 | 5
  quadrant: 'do_first' | 'schedule' | 'delegate' | 'eliminate'
  taskId?: string
  noteId?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  estimatedDuration?: number
  tags?: string[]
  priority: number
  color?: string
  isCompleted?: boolean
}

export interface LocalUserProfile {
  currency: {
    code: string
    symbol: string
    name: string
    rate?: number
  }
  safetyBufferPercent: number
  themeMode: 'light' | 'dark' | 'system'
}

// Sync-related types
export interface SyncResult<T> {
  success: boolean
  data?: T[]
  error?: string
  conflicts?: SyncConflict<T>[]
  syncedCount?: number
  lastSyncTime?: string
}

export interface SyncConflict<T> {
  local: T
  remote: T
  type: 'UPDATE_CONFLICT' | 'DELETE_CONFLICT'
  resolution?: 'LOCAL_WINS' | 'REMOTE_WINS' | 'MERGE' | 'MANUAL'
}

export interface SyncOptions {
  forceSync?: boolean
  conflictResolution?: 'local' | 'remote' | 'manual'
  batchSize?: number
  includeDeleted?: boolean
}

// Connection state types
export interface ConnectionState {
  isOnline: boolean
  isConnectedToSupabase: boolean
  lastPingTime?: Date
  networkType?: 'wifi' | 'cellular' | 'unknown'
}

// Offline queue types
export interface OfflineAction {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  table: string
  data: any
  timestamp: string
  retries: number
  maxRetries: number
}

export interface OfflineQueue {
  actions: OfflineAction[]
  isProcessing: boolean
  lastProcessedTime?: Date
}