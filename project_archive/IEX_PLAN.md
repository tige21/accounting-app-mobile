# WalletWatch Supabase Migration - Implementation Execution Plan (IEX)

## Overview

This IEX plan provides detailed technical implementation steps for migrating WalletWatch from AsyncStorage to Supabase while maintaining offline-first functionality.

## Prerequisites Checklist

- [x] Supabase account and project setup
- [x] Database schema designed and documented
- [x] RLS policies defined
- [ ] Environment variables configured
- [ ] Development/staging environments ready
- [ ] Testing data prepared

## Phase 1: Foundation Setup (Weeks 1-2)

### Week 1: Database and Authentication

#### Day 1-2: Supabase Project Setup
```bash
# Tasks:
1. Create Supabase project
2. Configure authentication settings
3. Set up environment variables
4. Execute database schema
5. Apply RLS policies
```

**Deliverables:**
- [x] `supabase/schema.sql` - Database schema
- [x] `supabase/rls-policies.sql` - Security policies
- [ ] Environment configuration file
- [ ] Supabase project documentation

**Implementation Steps:**
```sql
-- 1. Execute schema creation
psql -h db.supabase.co -U postgres -d postgres -f supabase/schema.sql

-- 2. Apply RLS policies
psql -h db.supabase.co -U postgres -d postgres -f supabase/rls-policies.sql

-- 3. Verify setup
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

#### Day 3-4: Environment Configuration
```bash
# Create environment files
touch .env.local .env.staging .env.production

# Add required variables
echo "EXPO_PUBLIC_SUPABASE_URL=your_supabase_url" >> .env.local
echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local
```

**Configuration Files:**
```typescript
// app.config.ts updates
export default {
  // ... existing config
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  }
}
```

#### Day 5: Dependencies Installation
```bash
# Install required packages
npm install @supabase/supabase-js @react-native-community/netinfo

# Update package.json with new dependencies
npm install --save-dev @types/node
```

### Week 2: Core Services Implementation

#### Day 1-2: Supabase Client Setup
```typescript
// File: services/supabase.ts (already created)
// Tasks:
1. Configure client with offline-first settings
2. Implement connection monitoring
3. Add authentication helpers  
4. Create retry mechanisms
5. Add connection state management
```

**Testing:**
```typescript
// Test connection
import { supabase, checkSupabaseConnection } from '@/services/supabase'

const testConnection = async () => {
  const isConnected = await checkSupabaseConnection()
  console.log('Supabase connected:', isConnected)
}
```

#### Day 3-4: Task Service Implementation
```typescript
// File: services/TaskService.ts (already created)
// Implementation status: ✅ Complete

// Testing tasks:
1. Test CRUD operations
2. Verify sync functionality
3. Test conflict resolution
4. Validate data mapping
5. Test bulk operations
```

**Testing Script:**
```typescript
// services/__tests__/TaskService.test.ts
import TaskService from '../TaskService'

describe('TaskService', () => {
  test('creates task successfully', async () => {
    const task = await TaskService.createTask({
      title: 'Test Task',
      date: '2025-01-01',
      time: '12:00',
      repeat: 'Никогда',
      reminder: 'Нет',
    })
    expect(task.id).toBeDefined()
    expect(task.title).toBe('Test Task')
  })
})
```

#### Day 5: Type Definitions Setup
```typescript
// File: types/supabase.ts (already created)
// Tasks:
1. Generate types from Supabase schema
2. Create local-to-remote mapping types
3. Add sync-related interfaces
4. Validate type correctness
```

**Type Generation Command:**
```bash
# Generate types from Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

## Phase 2: Data Services Implementation (Week 3)

### Transaction Service Implementation

#### Day 1-2: TransactionService.ts
```typescript
// File: services/TransactionService.ts
import { supabase, getCurrentUserId, retrySupabaseOperation } from './supabase'
import { LocalTransaction, DbTransaction, SyncResult } from '@/types/supabase'

export class TransactionService {
  private static readonly TABLE_NAME = 'transactions'

  // Implement following TaskService pattern:
  static async createTransaction(transaction: Omit<LocalTransaction, 'id'>): Promise<LocalTransaction> {
    // Implementation here
  }

  static async syncTransactions(
    localTransactions: LocalTransaction[],
    lastSyncTime?: string
  ): Promise<SyncResult<LocalTransaction>> {
    // Implementation here
  }

  static async bulkCreateTransactions(transactions: Omit<LocalTransaction, 'id'>[]): Promise<SyncResult<LocalTransaction>> {
    // Implementation here
  }
}
```

#### Day 3: NoteService.ts
```typescript
// File: services/NoteService.ts
export class NoteService {
  private static readonly TABLE_NAME = 'notes'
  private static readonly TODO_TABLE_NAME = 'todo_items'

  // Handle complex notes with todo items
  static async createNoteWithTodos(note: Omit<LocalNote, 'id'>): Promise<LocalNote> {
    // Implementation with transaction handling
  }

  static async syncNotes(localNotes: LocalNote[]): Promise<SyncResult<LocalNote>> {
    // Implementation here
  }
}
```

#### Day 4: EisenhowerService.ts
```typescript
// File: services/EisenhowerService.ts  
export class EisenhowerService {
  private static readonly TABLE_NAME = 'eisenhower_items'

  // Handle cross-references to tasks and notes
  static async createEisenhowerItem(item: Omit<LocalEisenhowerItem, 'id'>): Promise<LocalEisenhowerItem> {
    // Implementation here
  }

  static async syncMatrix(localItems: LocalEisenhowerItem[]): Promise<SyncResult<LocalEisenhowerItem>> {
    // Implementation here  
  }
}
```

#### Day 5: Service Integration Testing
```bash
# Run comprehensive service tests
npm run test services/

# Test data consistency
npm run test:integration
```

## Phase 3: Migration System (Week 4)

### Migration Service Implementation

#### Day 1-2: Complete MigrationService.ts
```typescript
// File: services/MigrationService.ts (already created)
// Additional implementation needed:

export class MigrationService {
  // Add missing service implementations
  static async migrateTransactions(transactions: LocalTransaction[]): Promise<number> {
    // Implement using TransactionService
  }

  static async migrateNotes(notes: LocalNote[]): Promise<number> {
    // Implement using NoteService  
  }

  static async migrateEisenhowerItems(items: LocalEisenhowerItem[]): Promise<number> {
    // Implement using EisenhowerService
  }
}
```

#### Day 3: Migration UI Components
```typescript
// File: components/MigrationModal/index.tsx
export const MigrationModal: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const runMigration = async () => {
    setMigrationStatus('running')
    try {
      const result = await MigrationService.migrateAllData({
        createBackup: true,
        clearLocalDataAfterMigration: false,
      })
      
      if (result.success) {
        setMigrationStatus('success')
      } else {
        setMigrationStatus('error')
      }
    } catch (error) {
      setMigrationStatus('error')
    }
  }

  // UI implementation
  return (
    // Migration progress UI
  )
}
```

#### Day 4-5: Migration Integration
```typescript
// File: hooks/useMigration.ts
export const useMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>()
  
  const checkMigrationNeeded = useCallback(async () => {
    const status = await MigrationService.getMigrationStatus()
    setMigrationStatus(status)
    return !status.completed && status.hasLocalData
  }, [])

  const performMigration = useCallback(async (options?: MigrationOptions) => {
    return await MigrationService.migrateAllData(options)
  }, [])

  return {
    migrationStatus,
    checkMigrationNeeded,
    performMigration,
  }
}
```

## Phase 4: Store Integration (Week 5)

### Updated Store Implementation

#### Day 1-2: Enhanced Task Store
```typescript
// File: store/taskStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import TaskService from '@/services/TaskService'
import { LocalTask, SyncResult } from '@/types/supabase'

interface EnhancedTaskStore extends TaskStore {
  // Add sync functionality
  syncTasks: () => Promise<SyncResult<LocalTask>>
  lastSyncTime: string | null
  syncStatus: 'idle' | 'syncing' | 'error' | 'success'
  
  // Enhanced operations with cloud sync
  addTaskWithSync: (task: Omit<LocalTask, 'id'>) => Promise<void>
  updateTaskWithSync: (id: string, updates: Partial<LocalTask>) => Promise<void>
  deleteTaskWithSync: (id: string) => Promise<void>
}

export const useTaskStore = create<EnhancedTaskStore>()(
  persist(
    (set, get) => ({
      // Existing local-first functionality
      ...existingTaskStore,
      
      // New sync functionality
      syncTasks: async () => {
        set({ syncStatus: 'syncing' })
        try {
          const { tasks, lastSyncTime } = get()
          const result = await TaskService.syncTasks(tasks, lastSyncTime)
          
          if (result.success && result.data) {
            set({ 
              tasks: result.data,
              lastSyncTime: result.lastSyncTime,
              syncStatus: 'success'
            })
          } else {
            set({ syncStatus: 'error' })
          }
          
          return result
        } catch (error) {
          set({ syncStatus: 'error' })
          throw error
        }
      },

      addTaskWithSync: async (task) => {
        // Add locally first (offline-first)
        const localTask = { ...task, id: Date.now().toString() }
        set(state => ({ tasks: [...state.tasks, localTask] }))

        // Sync to cloud if online
        try {
          const cloudTask = await TaskService.createTask(task)
          // Update with cloud ID and sync timestamp
          set(state => ({
            tasks: state.tasks.map(t => 
              t.id === localTask.id ? cloudTask : t
            )
          }))
        } catch (error) {
          // Handle offline scenario - keep local task
          console.log('Task will sync when online:', error)
        }
      },
      
      // ... other sync methods
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

#### Day 3: Sync Orchestration Hook
```typescript
// File: hooks/useSync.ts
export const useSync = () => {
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline: false,
    isSupabaseConnected: false,
    lastSyncTime: null,
    syncInProgress: false,
  })

  const syncAllStores = useCallback(async () => {
    if (!syncState.isOnline || !syncState.isSupabaseConnected) return

    setSyncState(prev => ({ ...prev, syncInProgress: true }))

    try {
      // Sync all data types
      await Promise.allSettled([
        useTaskStore.getState().syncTasks(),
        useTransactionStore.getState().syncTransactions(),
        useNoteStore.getState().syncNotes(),
        useEisenhowerStore.getState().syncMatrix(),
      ])

      setSyncState(prev => ({ 
        ...prev, 
        syncInProgress: false,
        lastSyncTime: new Date().toISOString()
      }))
    } catch (error) {
      setSyncState(prev => ({ ...prev, syncInProgress: false }))
      throw error
    }
  }, [syncState.isOnline, syncState.isSupabaseConnected])

  // Auto-sync on connection changes
  useEffect(() => {
    if (syncState.isOnline && syncState.isSupabaseConnected) {
      syncAllStores()
    }
  }, [syncState.isOnline, syncState.isSupabaseConnected, syncAllStores])

  return {
    syncState,
    syncAllStores,
  }
}
```

#### Day 4-5: App Integration
```typescript
// File: app/_layout.tsx
export default function RootLayout() {
  const { migrationStatus, checkMigrationNeeded, performMigration } = useMigration()
  const { syncState, syncAllStores } = useSync()
  const [showMigrationModal, setShowMigrationModal] = useState(false)

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      // Check if migration is needed
      const needsMigration = await checkMigrationNeeded()
      if (needsMigration) {
        setShowMigrationModal(true)
      } else {
        // Start sync if user is authenticated
        const isAuthenticated = await getCurrentUserId()
        if (isAuthenticated) {
          syncAllStores()
        }
      }
    }

    initializeApp()
  }, [])

  return (
    <Stack>
      {/* Existing app structure */}
      
      {showMigrationModal && (
        <MigrationModal 
          onComplete={() => {
            setShowMigrationModal(false)
            syncAllStores()
          }}
          onSkip={() => setShowMigrationModal(false)}
        />
      )}
    </Stack>
  )
}
```

## Phase 5: Testing & Optimization (Week 6)

### Comprehensive Testing Strategy

#### Day 1: Unit Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest-expo

# Test files to create:
services/__tests__/TaskService.test.ts
services/__tests__/TransactionService.test.ts  
services/__tests__/NoteService.test.ts
services/__tests__/MigrationService.test.ts
hooks/__tests__/useSync.test.ts
```

#### Day 2: Integration Testing
```typescript
// File: __tests__/integration/sync.test.ts
describe('Data Synchronization', () => {
  test('syncs tasks bidirectionally', async () => {
    // Create local tasks
    // Sync to cloud  
    // Modify on another client
    // Sync back and verify merge
  })

  test('handles sync conflicts correctly', async () => {
    // Create conflicting changes
    // Verify conflict resolution
  })
})
```

#### Day 3: Performance Testing
```typescript
// File: __tests__/performance/sync-performance.test.ts
describe('Sync Performance', () => {
  test('syncs 1000 tasks in under 5 seconds', async () => {
    const startTime = Date.now()
    await TaskService.bulkCreateTasks(generateTasks(1000))
    const endTime = Date.now()
    
    expect(endTime - startTime).toBeLessThan(5000)
  })
})
```

#### Day 4: Error Handling Testing
```typescript
// File: __tests__/error-handling/offline.test.ts
describe('Offline Scenarios', () => {
  test('handles offline gracefully', async () => {
    // Simulate offline state
    // Verify local operations continue
    // Verify sync resumes when online
  })
})
```

#### Day 5: User Acceptance Testing
```bash
# Create test scenarios
1. New user onboarding
2. Existing user migration
3. Multi-device sync
4. Offline/online transitions
5. Data recovery scenarios
```

## Phase 6: Deployment & Monitoring (Week 7-8)

### Deployment Strategy

#### Week 7: Staging Deployment
```bash
# Day 1-2: Staging Environment Setup
1. Configure staging Supabase project
2. Deploy app to internal testing
3. Run automated test suite
4. Performance benchmarking

# Day 3-4: Beta Testing
1. Deploy to limited beta users
2. Monitor crash reports and errors
3. Collect user feedback
4. Performance optimization

# Day 5: Production Preparation
1. Production environment setup
2. Final security review
3. Backup and rollback procedures
4. Monitoring and alerting setup
```

#### Week 8: Production Deployment
```bash
# Day 1-2: Phased Rollout
1. Deploy to 10% of users
2. Monitor key metrics
3. Address any critical issues
4. Expand to 50% if stable

# Day 3-4: Full Deployment
1. Deploy to all users
2. Monitor migration success rates
3. User support and issue resolution
4. Performance tuning

# Day 5: Post-Launch Optimization
1. Analyze migration results
2. User feedback integration
3. Performance improvements
4. Documentation updates
```

### Monitoring & Alerting

```typescript
// File: services/monitoring.ts
export class MonitoringService {
  static trackMigrationEvent(event: string, data?: any) {
    // Analytics tracking
  }

  static trackSyncPerformance(operation: string, duration: number) {
    // Performance monitoring
  }

  static reportError(error: Error, context?: string) {
    // Error reporting
  }
}
```

### Success Criteria Validation

#### Technical Metrics
- [ ] Migration success rate > 99.5%
- [ ] Average sync time < 3 seconds
- [ ] App startup time < 2 seconds
- [ ] Crash rate < 0.1%

#### User Experience Metrics
- [ ] User satisfaction > 4.5/5
- [ ] Support ticket volume < 2% of user base
- [ ] Feature adoption > 70%
- [ ] App store rating maintained > 4.0

## Rollback Procedures

### Emergency Rollback
```bash
# If critical issues arise:
1. Revert to previous app version
2. Disable cloud sync features
3. Restore from backup if needed
4. Communicate with users
```

### Data Recovery
```typescript
// File: services/DataRecovery.ts
export class DataRecoveryService {
  static async recoverFromBackup(backupId: string) {
    // Restore user data from backup
  }

  static async exportUserData(userId: string) {
    // Export all user data for recovery
  }
}
```

## Post-Launch Activities

### Week 9-10: Optimization
- Performance tuning based on real-world usage
- User feedback integration
- Bug fixes and stability improvements
- Advanced features development

### Week 11-12: Enhancement
- Real-time collaboration features
- Advanced analytics
- API for third-party integrations
- Cross-platform web app foundation

This IEX plan provides a detailed roadmap for successfully migrating WalletWatch to Supabase while maintaining the high-quality user experience the app is known for.