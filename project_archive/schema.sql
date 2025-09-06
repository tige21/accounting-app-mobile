-- WalletWatch Supabase Database Schema
-- This file contains the complete database schema for migrating from AsyncStorage to Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS todo_items CASCADE;
DROP TABLE IF EXISTS eisenhower_items CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS notebooks CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for authentication (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- User profiles for app-specific settings and preferences
CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    display_name TEXT,
    preferred_language TEXT DEFAULT 'ru' CHECK (preferred_language IN ('ru', 'en')),
    
    -- Currency settings
    currency_code TEXT DEFAULT 'RUB' NOT NULL,
    currency_symbol TEXT DEFAULT '₽' NOT NULL,
    currency_name TEXT DEFAULT 'Российский рубль' NOT NULL,
    currency_rate DECIMAL(10,4) DEFAULT 1.0 NOT NULL CHECK (currency_rate > 0),
    
    -- App settings
    safety_buffer_percent INTEGER DEFAULT 20 CHECK (safety_buffer_percent BETWEEN 0 AND 100),
    theme_mode TEXT DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
    monthly_budget DECIMAL(12,2) DEFAULT 0 CHECK (monthly_budget >= 0),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table for task scheduling and management
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Task details
    title TEXT NOT NULL CHECK (length(title) > 0),
    date DATE NOT NULL,
    time TIME NOT NULL,
    comment TEXT DEFAULT '',
    
    -- Task behavior
    repeat_type TEXT DEFAULT 'Никогда' CHECK (
        repeat_type IN ('Никогда', 'Ежедневно', 'Еженедельно', 'Ежемесячно', 'Ежегодно')
    ),
    reminder_type TEXT DEFAULT 'Нет' CHECK (
        reminder_type IN ('Нет', 'За 5 минут', 'За 15 минут', 'За 1 час', 'За 1 день', 'За 1 неделю')
    ),
    
    -- Task state
    is_completed BOOLEAN DEFAULT FALSE,
    last_completed_date DATE,
    
    -- Notification system
    notification_time TEXT, -- ISO timestamp
    notification_id TEXT,   -- Platform-specific notification ID
    
    -- Sync metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CHECK (last_completed_date IS NULL OR last_completed_date <= CURRENT_DATE)
);

-- Transactions table for financial tracking
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Transaction details
    category TEXT NOT NULL CHECK (length(category) > 0),
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),
    color TEXT NOT NULL CHECK (length(color) > 0), -- Hex color code
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    date DATE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    
    -- Sync metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notebooks table for organizing notes
CREATE TABLE notebooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL CHECK (length(title) > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table for note-taking functionality
CREATE TABLE notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    notebook_id UUID REFERENCES notebooks(id) ON DELETE SET NULL,
    
    -- Note content
    title TEXT NOT NULL CHECK (length(title) > 0),
    content TEXT DEFAULT '',
    is_completed BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Todo items within notes
CREATE TABLE todo_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
    
    -- Todo details
    text TEXT NOT NULL CHECK (length(text) > 0),
    is_completed BOOLEAN DEFAULT FALSE,
    
    -- Notifications for todos
    notification_time TIME,
    notification_date DATE,
    notification_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CHECK (
        (notification_time IS NULL AND notification_date IS NULL) OR
        (notification_time IS NOT NULL AND notification_date IS NOT NULL)
    )
);

-- Eisenhower Matrix items for priority management
CREATE TABLE eisenhower_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Optional relationships to existing data
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
    
    -- Matrix item details
    title TEXT NOT NULL CHECK (length(title) > 0),
    description TEXT DEFAULT '',
    
    -- Priority matrix values
    urgency INTEGER NOT NULL CHECK (urgency BETWEEN 1 AND 5),
    importance INTEGER NOT NULL CHECK (importance BETWEEN 1 AND 5),
    quadrant TEXT NOT NULL CHECK (quadrant IN ('do_first', 'schedule', 'delegate', 'eliminate')),
    priority INTEGER NOT NULL CHECK (priority > 0),
    
    -- Additional metadata
    estimated_duration INTEGER CHECK (estimated_duration > 0), -- in minutes
    tags TEXT[] DEFAULT '{}',
    color TEXT, -- Optional custom color
    
    -- Completion state
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CHECK (
        (is_completed = FALSE AND completed_at IS NULL) OR
        (is_completed = TRUE AND completed_at IS NOT NULL)
    )
);

-- Create indexes for optimal query performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_tasks_is_completed ON tasks(is_completed);
CREATE INDEX idx_tasks_repeat_type ON tasks(repeat_type);
CREATE INDEX idx_tasks_updated_at ON tasks(updated_at);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_updated_at ON transactions(updated_at);

CREATE INDEX idx_notebooks_user_id ON notebooks(user_id);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_notebook_id ON notes(notebook_id);
CREATE INDEX idx_notes_is_completed ON notes(is_completed);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);

CREATE INDEX idx_todo_items_note_id ON todo_items(note_id);
CREATE INDEX idx_todo_items_is_completed ON todo_items(is_completed);
CREATE INDEX idx_todo_items_notification_date ON todo_items(notification_date);

CREATE INDEX idx_eisenhower_items_user_id ON eisenhower_items(user_id);
CREATE INDEX idx_eisenhower_items_quadrant ON eisenhower_items(quadrant);
CREATE INDEX idx_eisenhower_items_priority ON eisenhower_items(priority DESC);
CREATE INDEX idx_eisenhower_items_task_id ON eisenhower_items(task_id);
CREATE INDEX idx_eisenhower_items_note_id ON eisenhower_items(note_id);
CREATE INDEX idx_eisenhower_items_is_completed ON eisenhower_items(is_completed);
CREATE INDEX idx_eisenhower_items_updated_at ON eisenhower_items(updated_at);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at timestamps
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notebooks_updated_at 
    BEFORE UPDATE ON notebooks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todo_items_updated_at 
    BEFORE UPDATE ON todo_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eisenhower_items_updated_at 
    BEFORE UPDATE ON eisenhower_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically calculate Eisenhower priority
CREATE OR REPLACE FUNCTION calculate_eisenhower_priority(urgency INTEGER, importance INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Priority formula: importance has higher weight than urgency
    RETURN (importance * 2) + urgency;
END;
$$ LANGUAGE plpgsql;

-- Function to determine Eisenhower quadrant
CREATE OR REPLACE FUNCTION determine_eisenhower_quadrant(urgency INTEGER, importance INTEGER)
RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN urgency >= 4 AND importance >= 4 THEN RETURN 'do_first';
        WHEN urgency < 4 AND importance >= 4 THEN RETURN 'schedule';
        WHEN urgency >= 4 AND importance < 4 THEN RETURN 'delegate';
        ELSE RETURN 'eliminate';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate priority and quadrant for Eisenhower items
CREATE OR REPLACE FUNCTION auto_calculate_eisenhower_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW.priority = calculate_eisenhower_priority(NEW.urgency, NEW.importance);
    
    -- Only auto-set quadrant if not explicitly provided
    IF NEW.quadrant IS NULL THEN
        NEW.quadrant = determine_eisenhower_quadrant(NEW.urgency, NEW.importance);
    END IF;
    
    -- Set completion timestamp
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        NEW.completed_at = NOW();
    ELSIF NEW.is_completed = FALSE AND OLD.is_completed = TRUE THEN
        NEW.completed_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calculate_eisenhower_fields_trigger
    BEFORE INSERT OR UPDATE ON eisenhower_items
    FOR EACH ROW EXECUTE FUNCTION auto_calculate_eisenhower_fields();

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts extending Supabase auth.users';
COMMENT ON TABLE user_profiles IS 'App-specific user settings and preferences';
COMMENT ON TABLE tasks IS 'Scheduled tasks with reminders and repeat functionality';
COMMENT ON TABLE transactions IS 'Financial transactions (income and expenses)';
COMMENT ON TABLE notebooks IS 'Organization containers for notes';
COMMENT ON TABLE notes IS 'User notes with optional todo lists';
COMMENT ON TABLE todo_items IS 'Individual todo items within notes';
COMMENT ON TABLE eisenhower_items IS 'Priority matrix items for task management';

COMMENT ON COLUMN tasks.repeat_type IS 'How often the task repeats';
COMMENT ON COLUMN tasks.reminder_type IS 'When to remind user about the task';
COMMENT ON COLUMN tasks.notification_id IS 'Platform-specific notification identifier';
COMMENT ON COLUMN transactions.color IS 'Hex color code for category visualization';
COMMENT ON COLUMN eisenhower_items.quadrant IS 'Eisenhower matrix quadrant classification';
COMMENT ON COLUMN eisenhower_items.priority IS 'Auto-calculated priority score';
COMMENT ON COLUMN eisenhower_items.estimated_duration IS 'Estimated time to complete in minutes';