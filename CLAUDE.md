# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "wallet Watch" (walletwatch) - a React Native mobile application built with Expo for financial tracking and task management. The app provides comprehensive expense/income tracking, analytics, task scheduling, and note-taking capabilities with **Supabase cloud synchronization**.

**Key Technologies:**
- React Native with Expo SDK 53
- TypeScript with strict mode
- Expo Router for file-based navigation
- Zustand for state management with AsyncStorage persistence
- Supabase for cloud sync and backend services
- @tanstack/react-query for data fetching
- NativeWind (Tailwind CSS) for styling
- i18next for internationalization (Russian/English)

## Development Commands

```bash
# Start development server
npm start
# or
expo start

# Platform-specific builds
npm run android
npm run ios  
npm run web

# Testing
npm test
```

## Architecture Overview

### Hybrid Data Architecture (Local + Cloud)

The app implements an **offline-first architecture** with Supabase synchronization:

- **Local State**: Zustand stores with AsyncStorage persistence for immediate operations
- **Cloud Sync**: Supabase backend with real-time synchronization when online
- **Offline Queue**: Failed operations are queued and retried when connection is restored
- **Conflict Resolution**: Timestamp-based conflict resolution with remote precedence

### Core Data Flow

1. **User Action** → Local Zustand store updated immediately (instant UI feedback)
2. **Background Sync** → Changes pushed to Supabase asynchronously  
3. **Network Recovery** → Offline queue processed, conflicts resolved
4. **Real-time Updates** → Remote changes pulled and merged locally

### Key Directories

- **`/app`** - Expo Router file-based navigation
  - `(tabs)/` - Main tab screens (tasks, analytics, Eisenhower matrix)
  - Root level screens (transaction, profile, task-details, etc.)

- **`/store`** - Zustand stores with dual persistence (local + cloud sync)
  - `taskStore.ts` - Task management with Supabase sync capabilities
  - `transactionStore.ts` - Financial transaction tracking
  - `noteStore.ts` - Note-taking functionality
  - `settingsStore.ts` - App settings and currency rates
  - `eisenhowerStore.ts` - Priority matrix management

- **`/services`** - Service layer for backend integration
  - `BaseService.ts` - Abstract base with offline queue, connection management
  - `TaskService.ts` - Task CRUD operations with conflict resolution
  - `MigrationService.ts` - Data migration from AsyncStorage to Supabase
  - `api.ts` - Axios instance for external API calls

- **`/lib`** - Core configuration
  - `supabase.ts` - Supabase client with offline-first configuration

- **`/types`** - TypeScript definitions
  - `supabase.ts` - Generated database types and conversion interfaces

### Supabase Integration

The app uses a sophisticated **offline-first** Supabase integration:

```typescript
// All stores follow this hybrid pattern
export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Local state
      tasks: [],
      syncState: { isOnline: true, hasPendingSync: false },
      
      // Operations update local state immediately, sync in background
      addTask: async (task) => {
        set(state => ({ tasks: [...state.tasks, task] })) // Immediate local update
        try {
          await taskService.createTask(task) // Background sync
        } catch (error) {
          // Add to offline queue for retry
          set(state => ({ syncState: { ...state.syncState, hasPendingSync: true }}))
        }
      }
    }),
    { name: 'tasks-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
)
```

### Service Layer Pattern

All services extend `BaseService` which provides:
- **Connection management** and health checks
- **Offline queue** with retry logic and exponential backoff  
- **Batch processing** for efficient bulk operations
- **Data transformation** between local and database formats
- **Conflict resolution** using timestamp-based strategies

```typescript
export class TaskService extends BaseService {
  // Transform between local Task and database DbTask formats
  private transformToDb(localTask: LocalTask, userId: string): InsertTask
  private transformToLocal(dbTask: DbTask): LocalTask
  
  // CRUD with offline-first approach
  async createTask(task: LocalTask): Promise<LocalTask>
  async updateTask(taskId: string, updates: Partial<LocalTask>): Promise<LocalTask>
  
  // Batch operations for migration/bulk sync
  async batchCreateTasks(tasks: LocalTask[]): Promise<SyncResult<LocalTask>>
  
  // Sync operations with conflict resolution
  async syncTasks(options: SyncOptions): Promise<SyncResult<LocalTask>>
}
```

## State Management Patterns

### Zustand Store Structure

Each store has both local persistence and cloud sync capabilities:

```typescript
interface TaskStore {
  // Local data
  tasks: Task[]
  
  // Sync state management
  syncState: {
    isLoading: boolean
    lastSyncTime?: string
    isOnline: boolean
    hasPendingSync: boolean
    syncError?: string
  }
  
  // CRUD operations (update local immediately, sync in background)
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  
  // Sync operations
  syncTasks: () => Promise<SyncResult<Task>>
  initializeSync: () => Promise<void>
  
  // Migration from old AsyncStorage-only data
  startMigration: () => Promise<void>
}
```

### Data Migration System

The app includes a comprehensive migration system (`MigrationService`) for users upgrading from local-only to cloud sync:

- **Backup creation** before migration begins
- **Progress tracking** with real-time callbacks  
- **Validation** of migrated data integrity
- **Rollback capability** if migration fails
- **Selective migration** (exclude certain tables if needed)

## Styling System

The app uses **NativeWind** (Tailwind CSS for React Native) with a custom design system:

```typescript
// tailwind.config.js defines app-specific colors
theme: {
  extend: {
    colors: {
      primary: '#007AFF',     // iOS blue
      matrix: {
        urgent: '#FF3B30',     // Eisenhower matrix quadrants
        important: '#FF9500',
        delegate: '#007AFF', 
        eliminate: '#8E8E93'
      }
    }
  }
}
```

Use class names in components: `className="bg-primary text-white p-4"`

## Development Guidelines

### Path Aliases
Use `@/*` imports configured in tsconfig.json:
```typescript
import { useTaskStore } from '@/store/taskStore'
import { taskService } from '@/services/TaskService'  
import { Database } from '@/types/supabase'
```

### Service Development
When creating new services:

1. **Extend BaseService** for offline capabilities
2. **Implement data transformation** methods (local ↔ database formats)  
3. **Add offline queue handling** in executeOfflineAction method
4. **Create corresponding Zustand store** integration
5. **Handle sync state** updates in store operations

### Store Integration Pattern

When integrating stores with services:

1. **Update local state first** (immediate UI feedback)
2. **Attempt cloud sync** in try/catch block
3. **Update sync state** to reflect network status
4. **Queue failed operations** for retry when online

### Supabase Environment Setup

Required environment variables in `.env.local`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The Supabase client in `lib/supabase.ts` includes offline-first configuration with AsyncStorage persistence for auth sessions.

### Testing

The project uses Jest with `jest-expo` preset. Test files should be placed alongside source files or in `__tests__` directories.

### Key Features Implementation Details

**Task Management**
- Automatic cleanup of completed recurring tasks using `cleanCompletedTasks()`
- Expo Notifications integration for reminders with background scheduling
- Russian language support for repeat/reminder types with database mapping

**Financial Tracking**  
- Multi-currency support with live exchange rate fetching
- Category-based expense/income tracking with color-coded UI
- Budget management with safety buffer calculations

**Eisenhower Matrix**
- Priority-based task organization across 4 quadrants  
- Cross-references with tasks and notes for integrated workflow
- Visual priority indicators using custom matrix colors

**Data Persistence**
- Hybrid local/cloud architecture preserves offline functionality
- AsyncStorage for immediate persistence, Supabase for sync and backup
- Migration tools for upgrading existing user data to cloud sync