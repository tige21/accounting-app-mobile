# Supabase Migration Plan for WalletWatch Mobile App

## Project Analysis Summary

**Current Architecture:**
- React Native with Expo SDK 53
- Zustand for state management with AsyncStorage persistence
- Local-first data storage with 5 main stores
- Russian/English i18n support
- Task scheduling with notifications

**Key Data Models Identified:**
1. **Tasks**: Scheduled tasks with reminders and repeat functionality
2. **Transactions**: Financial income/expense tracking with categories
3. **Notes**: Note-taking with todos and notebook organization
4. **Settings**: Currency preferences and app configuration
5. **Eisenhower Matrix**: Priority-based task management system

## 1. Database Schema Design

### Core Tables Structure

```sql
-- Enable RLS and necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table for authentication
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- User profiles for app-specific data
CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT,
    preferred_language TEXT DEFAULT 'ru',
    currency_code TEXT DEFAULT 'RUB',
    currency_symbol TEXT DEFAULT '₽',
    currency_name TEXT DEFAULT 'Российский рубль',
    currency_rate DECIMAL(10,4) DEFAULT 1.0,
    safety_buffer_percent INTEGER DEFAULT 20,
    theme_mode TEXT DEFAULT 'system',
    monthly_budget DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tasks table
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    repeat_type TEXT CHECK (repeat_type IN ('Никогда', 'Ежедневно', 'Еженедельно', 'Ежемесячно', 'Ежегодно')) DEFAULT 'Никогда',
    reminder_type TEXT CHECK (reminder_type IN ('Нет', 'За 5 минут', 'За 15 минут', 'За 1 час', 'За 1 день', 'За 1 неделю')) DEFAULT 'Нет',
    comment TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    last_completed_date DATE,
    notification_time TEXT,
    notification_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    color TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notebooks table
CREATE TABLE notebooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    is_completed BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Todo items for notes
CREATE TABLE todo_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    notification_time TIME,
    notification_date DATE,
    notification_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eisenhower Matrix items
CREATE TABLE eisenhower_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    urgency INTEGER CHECK (urgency BETWEEN 1 AND 5) NOT NULL,
    importance INTEGER CHECK (importance BETWEEN 1 AND 5) NOT NULL,
    quadrant TEXT CHECK (quadrant IN ('do_first', 'schedule', 'delegate', 'eliminate')) NOT NULL,
    priority INTEGER NOT NULL,
    estimated_duration INTEGER, -- in minutes
    tags TEXT[] DEFAULT '{}',
    color TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_tasks_is_completed ON tasks(is_completed);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_notebook_id ON notes(notebook_id);
CREATE INDEX idx_eisenhower_items_user_id ON eisenhower_items(user_id);
CREATE INDEX idx_eisenhower_items_quadrant ON eisenhower_items(quadrant);
CREATE INDEX idx_todo_items_note_id ON todo_items(note_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notebooks_updated_at BEFORE UPDATE ON notebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_todo_items_updated_at BEFORE UPDATE ON todo_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eisenhower_items_updated_at BEFORE UPDATE ON eisenhower_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE eisenhower_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Users can view own user_profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- Notebooks policies
CREATE POLICY "Users can view own notebooks" ON notebooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notebooks" ON notebooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notebooks" ON notebooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notebooks" ON notebooks FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Todo items policies (through notes)
CREATE POLICY "Users can view todo_items of own notes" ON todo_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = todo_items.note_id AND notes.user_id = auth.uid())
);
CREATE POLICY "Users can insert todo_items to own notes" ON todo_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = todo_items.note_id AND notes.user_id = auth.uid())
);
CREATE POLICY "Users can update todo_items of own notes" ON todo_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = todo_items.note_id AND notes.user_id = auth.uid())
);
CREATE POLICY "Users can delete todo_items of own notes" ON todo_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = todo_items.note_id AND notes.user_id = auth.uid())
);

-- Eisenhower items policies
CREATE POLICY "Users can view own eisenhower_items" ON eisenhower_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own eisenhower_items" ON eisenhower_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own eisenhower_items" ON eisenhower_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own eisenhower_items" ON eisenhower_items FOR DELETE USING (auth.uid() = user_id);
```

## 2. Service Layer Architecture

### Supabase Configuration

```typescript
// services/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Connection state management
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}
```

### Service Classes

```typescript
// services/TaskService.ts
import { supabase } from './supabase'
import { Task } from '@/types/task'
import { Database } from '@/types/supabase'

type DbTask = Database['public']['Tables']['tasks']['Row']

export class TaskService {
  static async syncTasks(localTasks: Task[]): Promise<{
    success: boolean
    syncedTasks?: Task[]
    error?: string
  }> {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('User not authenticated')

      // Get remote tasks
      const { data: remoteTasks, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.user.id)

      if (fetchError) throw fetchError

      // Sync logic: merge local and remote tasks
      const syncedTasks = await this.mergeTasks(localTasks, remoteTasks || [])
      
      return { success: true, syncedTasks }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async createTask(task: Omit<Task, 'id'>): Promise<Task | null> {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return null

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        user_id: user.user.id,
        synced_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return this.mapDbTaskToTask(data)
  }

  private static mapDbTaskToTask(dbTask: DbTask): Task {
    return {
      id: dbTask.id,
      title: dbTask.title,
      date: dbTask.date,
      time: dbTask.time,
      repeat: dbTask.repeat_type as Task['repeat'],
      reminder: dbTask.reminder_type as Task['reminder'],
      comment: dbTask.comment || '',
      isCompleted: dbTask.is_completed || false,
      lastCompletedDate: dbTask.last_completed_date || undefined,
      notificationTime: dbTask.notification_time || undefined,
      notificationId: dbTask.notification_id || undefined,
    }
  }

  private static async mergeTasks(localTasks: Task[], remoteTasks: DbTask[]): Promise<Task[]> {
    // Implementation for conflict resolution
    // Priority: most recent updated_at timestamp wins
    const mergedTasks: Task[] = []
    
    // Convert remote tasks
    const remoteTasksConverted = remoteTasks.map(this.mapDbTaskToTask)
    
    // Merge logic here...
    
    return mergedTasks
  }
}
```

## 3. Migration Strategy

### Phase 1: Foundation Setup (Week 1-2)
1. **Supabase Project Setup**
   - Create project and configure authentication
   - Set up database schema with RLS policies
   - Configure environment variables

2. **Service Layer Development**
   - Implement base Supabase client configuration
   - Create abstract base service class
   - Implement connection state management

### Phase 2: Authentication Integration (Week 2-3)
1. **Auth System**
   - Implement Supabase Auth
   - Create anonymous user support for offline-first
   - Add user profile management

2. **Data Migration Utilities**
   - Create migration scripts for existing AsyncStorage data
   - Implement data backup/restore functionality

### Phase 3: Progressive Data Sync (Week 3-5)
1. **Tasks Sync (Week 3)**
   - Implement TaskService with offline-first approach
   - Add conflict resolution for concurrent edits
   - Maintain notification system compatibility

2. **Transactions Sync (Week 4)**
   - Implement TransactionService
   - Add bulk sync capabilities for large datasets
   - Preserve financial calculation accuracy

3. **Notes & Eisenhower Matrix (Week 5)**
   - Implement NoteService with todo items
   - Add EisenhowerService with cross-references
   - Maintain complex relationship syncing

### Phase 4: Advanced Features (Week 5-6)
1. **Real-time Subscriptions**
   - Implement real-time updates for collaborative features
   - Add conflict resolution with operational transforms

2. **Performance Optimization**
   - Implement incremental sync
   - Add intelligent caching with React Query
   - Optimize for mobile network conditions

## 4. Offline-First Strategy

### Sync State Management
```typescript
// store/syncStore.ts
interface SyncStore {
  isOnline: boolean
  lastSyncTime: Date | null
  pendingSync: {
    tasks: string[]
    transactions: string[]
    notes: string[]
    eisenhowerItems: string[]
  }
  syncInProgress: boolean
  conflictResolution: 'local' | 'remote' | 'manual'
}
```

### Conflict Resolution Strategy
1. **Automatic Resolution**: Use timestamp-based winner selection
2. **Manual Resolution**: Present diff UI for user choice
3. **Operational Transform**: For real-time collaborative editing

## 5. Implementation Plan (IEX)

### Week 1-2: Foundation
- [ ] Set up Supabase project and database schema
- [ ] Implement authentication system
- [ ] Create base service architecture
- [ ] Add environment configuration

### Week 3: Tasks Migration
- [ ] Implement TaskService with full CRUD
- [ ] Add offline sync capabilities
- [ ] Maintain notification compatibility
- [ ] Test with existing task cleanup logic

### Week 4: Financial Data Migration  
- [ ] Implement TransactionService
- [ ] Add FinanceService integration
- [ ] Preserve calculation accuracy
- [ ] Test currency conversion features

### Week 5: Notes & Matrix Migration
- [ ] Implement NoteService with todo items
- [ ] Add EisenhowerService with relationships
- [ ] Maintain cross-store synchronization
- [ ] Test complex data relationships

### Week 6: Optimization & Testing
- [ ] Implement real-time subscriptions
- [ ] Add performance optimizations
- [ ] Complete integration testing
- [ ] Deploy and monitor

## 6. Risk Mitigation

### Technical Risks
1. **Data Loss**: Implement comprehensive backup before migration
2. **Sync Conflicts**: Use timestamp-based conflict resolution
3. **Network Issues**: Maintain robust offline-first functionality
4. **Performance**: Implement incremental sync and caching

### Business Risks
1. **User Experience**: Maintain current UX during migration
2. **Downtime**: Implement zero-downtime deployment
3. **Cost**: Monitor Supabase usage and optimize queries

### Rollback Strategy
1. Maintain parallel AsyncStorage system during migration
2. Implement feature flags for gradual rollout
3. Create automated rollback procedures

## 7. Success Metrics

### Technical Metrics
- Sync success rate > 99.5%
- Average sync time < 3 seconds
- Offline functionality maintained
- Zero data loss incidents

### User Experience Metrics
- App launch time remains < 2 seconds
- No user-visible sync conflicts
- Seamless cross-device synchronization
- Maintained notification reliability

This comprehensive migration plan ensures a smooth transition from local AsyncStorage to Supabase while maintaining the app's offline-first approach and excellent user experience.