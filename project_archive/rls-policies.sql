-- Row Level Security (RLS) Policies for WalletWatch
-- This file contains all RLS policies to ensure users can only access their own data

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE eisenhower_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for development)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Users can view own user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own user_profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

DROP POLICY IF EXISTS "Users can view own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Users can insert own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Users can update own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Users can delete own notebooks" ON notebooks;

DROP POLICY IF EXISTS "Users can view own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON notes;
DROP POLICY IF EXISTS "Users can update own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON notes;

DROP POLICY IF EXISTS "Users can view todo_items of own notes" ON todo_items;
DROP POLICY IF EXISTS "Users can insert todo_items to own notes" ON todo_items;
DROP POLICY IF EXISTS "Users can update todo_items of own notes" ON todo_items;
DROP POLICY IF EXISTS "Users can delete todo_items of own notes" ON todo_items;

DROP POLICY IF EXISTS "Users can view own eisenhower_items" ON eisenhower_items;
DROP POLICY IF EXISTS "Users can insert own eisenhower_items" ON eisenhower_items;
DROP POLICY IF EXISTS "Users can update own eisenhower_items" ON eisenhower_items;
DROP POLICY IF EXISTS "Users can delete own eisenhower_items" ON eisenhower_items;

-- =============================================================================
-- USERS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view own profile" 
    ON users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON users FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- =============================================================================
-- USER PROFILES TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view own user_profile" 
    ON user_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_profile" 
    ON user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_profile" 
    ON user_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- =============================================================================
-- TASKS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view own tasks" 
    ON tasks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" 
    ON tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" 
    ON tasks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" 
    ON tasks FOR DELETE 
    USING (auth.uid() = user_id);

-- =============================================================================
-- TRANSACTIONS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view own transactions" 
    ON transactions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
    ON transactions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" 
    ON transactions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" 
    ON transactions FOR DELETE 
    USING (auth.uid() = user_id);

-- =============================================================================
-- NOTEBOOKS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view own notebooks" 
    ON notebooks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notebooks" 
    ON notebooks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notebooks" 
    ON notebooks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notebooks" 
    ON notebooks FOR DELETE 
    USING (auth.uid() = user_id);

-- =============================================================================
-- NOTES TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view own notes" 
    ON notes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" 
    ON notes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" 
    ON notes FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" 
    ON notes FOR DELETE 
    USING (auth.uid() = user_id);

-- =============================================================================
-- TODO ITEMS TABLE POLICIES (Access through notes ownership)
-- =============================================================================

CREATE POLICY "Users can view todo_items of own notes" 
    ON todo_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = todo_items.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert todo_items to own notes" 
    ON todo_items FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = todo_items.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update todo_items of own notes" 
    ON todo_items FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = todo_items.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete todo_items of own notes" 
    ON todo_items FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = todo_items.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- =============================================================================
-- EISENHOWER ITEMS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view own eisenhower_items" 
    ON eisenhower_items FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own eisenhower_items" 
    ON eisenhower_items FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own eisenhower_items" 
    ON eisenhower_items FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own eisenhower_items" 
    ON eisenhower_items FOR DELETE 
    USING (auth.uid() = user_id);

-- =============================================================================
-- ADDITIONAL SECURITY FUNCTIONS
-- =============================================================================

-- Function to check if user owns a task (for cross-table validation)
CREATE OR REPLACE FUNCTION user_owns_task(task_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tasks 
        WHERE id = task_uuid 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns a note (for cross-table validation)
CREATE OR REPLACE FUNCTION user_owns_note(note_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM notes 
        WHERE id = note_uuid 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced policy for eisenhower_items with task/note validation
-- This ensures that users can only link eisenhower items to their own tasks/notes
DROP POLICY IF EXISTS "Eisenhower items task/note ownership validation" ON eisenhower_items;

CREATE POLICY "Eisenhower items task/note ownership validation" 
    ON eisenhower_items FOR ALL
    USING (
        auth.uid() = user_id 
        AND (task_id IS NULL OR user_owns_task(task_id))
        AND (note_id IS NULL OR user_owns_note(note_id))
    )
    WITH CHECK (
        auth.uid() = user_id 
        AND (task_id IS NULL OR user_owns_task(task_id))
        AND (note_id IS NULL OR user_owns_note(note_id))
    );

-- =============================================================================
-- ANONYMOUS USER SUPPORT (FOR OFFLINE-FIRST APPROACH)
-- =============================================================================

-- Allow anonymous users to access their own data
-- This supports the offline-first approach where users might not be authenticated initially

CREATE POLICY "Anonymous users can manage their data" 
    ON user_profiles FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Apply similar anonymous policies to other tables
CREATE POLICY "Anonymous users can manage tasks" 
    ON tasks FOR ALL
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Anonymous users can manage transactions" 
    ON transactions FOR ALL
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Anonymous users can manage notebooks" 
    ON notebooks FOR ALL
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Anonymous users can manage notes" 
    ON notes FOR ALL
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Anonymous users can manage eisenhower items" 
    ON eisenhower_items FOR ALL
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- =============================================================================
-- PERFORMANCE OPTIMIZATION POLICIES
-- =============================================================================

-- Create policy for efficient bulk operations
CREATE POLICY "Bulk operations optimization" 
    ON tasks FOR SELECT
    USING (
        auth.uid() = user_id 
        AND updated_at > COALESCE(
            (SELECT last_sync FROM user_sync_state WHERE user_id = auth.uid()),
            '1970-01-01'::timestamp
        )
    );

-- Create sync state table for tracking last sync times
CREATE TABLE IF NOT EXISTS user_sync_state (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sync_version INTEGER DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_sync_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sync state" 
    ON user_sync_state FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- AUDIT AND MONITORING
-- =============================================================================

-- Create audit log table for monitoring data changes
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    record_id UUID,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for audit log - users can only see their own audit entries
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit log" 
    ON audit_log FOR SELECT 
    USING (auth.uid() = user_id);

-- =============================================================================
-- SECURITY VALIDATIONS
-- =============================================================================

-- Additional validation: Ensure eisenhower items urgency/importance are valid
ALTER TABLE eisenhower_items ADD CONSTRAINT valid_urgency_importance 
    CHECK (urgency BETWEEN 1 AND 5 AND importance BETWEEN 1 AND 5);

-- Validation: Ensure notification dates are not in the past
ALTER TABLE todo_items ADD CONSTRAINT future_notification_date 
    CHECK (notification_date IS NULL OR notification_date >= CURRENT_DATE);

-- Validation: Ensure task dates are reasonable
ALTER TABLE tasks ADD CONSTRAINT reasonable_task_date 
    CHECK (date >= '2020-01-01' AND date <= '2050-12-31');

-- Validation: Ensure transaction dates are reasonable  
ALTER TABLE transactions ADD CONSTRAINT reasonable_transaction_date 
    CHECK (date >= '2020-01-01' AND date <= CURRENT_DATE + INTERVAL '1 year');

COMMENT ON POLICY "Users can view own profile" ON users IS 'Users can only access their own profile data';
COMMENT ON POLICY "Eisenhower items task/note ownership validation" ON eisenhower_items IS 'Ensures eisenhower items can only link to user-owned tasks and notes';
COMMENT ON TABLE user_sync_state IS 'Tracks last sync times for efficient incremental sync';
COMMENT ON TABLE audit_log IS 'Audit trail for monitoring data changes and security';