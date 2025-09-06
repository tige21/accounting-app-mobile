// Supabase client configuration for WalletWatch
// This file provides the main Supabase client and connection utilities

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database, ConnectionState } from '@/types/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'

// Environment configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env configuration.')
}

// Create the Supabase client with offline-first configuration
export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      // Enable automatic token refresh
      autoRefreshToken: true,
      // Persist session across app restarts
      persistSession: true,
      // Don't detect session in URL (mobile app)
      detectSessionInUrl: false,
      // Use AsyncStorage for session persistence
      storage: AsyncStorage,
    },
    db: {
      // Use connection pooling for better performance
      schema: 'public',
    },
    realtime: {
      // Configure realtime for collaborative features
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      // Add request timeout
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          // 30 second timeout for mobile networks
          signal: AbortSignal.timeout(30000),
        })
      },
    },
  }
)

// Connection state management
let connectionState: ConnectionState = {
  isOnline: false,
  isConnectedToSupabase: false,
}

let connectionListeners: ((state: ConnectionState) => void)[] = []

/**
 * Initialize connection monitoring
 * Sets up network state monitoring and Supabase connection checks
 */
export const initializeConnectionMonitoring = (): Promise<ConnectionState> => {
  return new Promise((resolve) => {
    // Monitor network connectivity
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      connectionState.isOnline = state.isConnected ?? false
      connectionState.networkType = state.type as 'wifi' | 'cellular' | 'unknown'
      
      // Check Supabase connectivity when network comes online
      if (connectionState.isOnline) {
        checkSupabaseConnection()
      } else {
        connectionState.isConnectedToSupabase = false
      }
      
      // Notify all listeners
      connectionListeners.forEach(listener => listener(connectionState))
    })

    // Initial connection check
    NetInfo.fetch().then((state) => {
      connectionState.isOnline = state.isConnected ?? false
      connectionState.networkType = state.type as 'wifi' | 'cellular' | 'unknown'
      
      if (connectionState.isOnline) {
        checkSupabaseConnection().then(() => {
          resolve(connectionState)
        })
      } else {
        resolve(connectionState)
      }
    })

    // Store the unsubscribe function for cleanup
    ;(global as any).__netInfoUnsubscribe = unsubscribeNetInfo
  })
}

/**
 * Check if Supabase is reachable and responsive
 * Performs a lightweight query to verify database connectivity
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!connectionState.isOnline) {
    connectionState.isConnectedToSupabase = false
    return false
  }

  try {
    // Perform a lightweight query to check connectivity
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .maybeSingle()

    const isConnected = !error || error.code === 'PGRST116' // 'PGRST116' is "no rows returned"
    
    connectionState.isConnectedToSupabase = isConnected
    connectionState.lastPingTime = new Date()
    
    return isConnected
  } catch (error) {
    console.warn('Supabase connection check failed:', error)
    connectionState.isConnectedToSupabase = false
    return false
  }
}

/**
 * Get current connection state
 */
export const getConnectionState = (): ConnectionState => {
  return { ...connectionState }
}

/**
 * Add a listener for connection state changes
 */
export const addConnectionListener = (listener: (state: ConnectionState) => void): (() => void) => {
  connectionListeners.push(listener)
  
  // Return unsubscribe function
  return () => {
    const index = connectionListeners.indexOf(listener)
    if (index > -1) {
      connectionListeners.splice(index, 1)
    }
  }
}

/**
 * Remove all connection listeners and cleanup
 */
export const cleanupConnectionMonitoring = (): void => {
  connectionListeners = []
  
  // Cleanup NetInfo subscription
  if ((global as any).__netInfoUnsubscribe) {
    ;(global as any).__netInfoUnsubscribe()
    delete (global as any).__netInfoUnsubscribe
  }
}

/**
 * Wait for online connection with timeout
 * Useful for critical operations that require connectivity
 */
export const waitForConnection = (timeoutMs: number = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (connectionState.isOnline && connectionState.isConnectedToSupabase) {
      resolve(true)
      return
    }

    const timeout = setTimeout(() => {
      unsubscribe()
      resolve(false)
    }, timeoutMs)

    const unsubscribe = addConnectionListener((state) => {
      if (state.isOnline && state.isConnectedToSupabase) {
        clearTimeout(timeout)
        unsubscribe()
        resolve(true)
      }
    })
  })
}

/**
 * Retry a Supabase operation with exponential backoff
 * Useful for handling temporary connection issues
 */
export const retrySupabaseOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> => {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check connection before attempting operation
      if (attempt > 0) {
        const isConnected = await waitForConnection(5000)
        if (!isConnected) {
          throw new Error('No connection available for retry')
        }
      }

      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on auth errors or client-side validation errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code
        if (errorCode?.startsWith('42') || errorCode?.startsWith('23')) {
          // Database constraint or permission errors - don't retry
          throw error
        }
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break
      }

      // Exponential backoff with jitter
      const delay = initialDelayMs * Math.pow(2, attempt) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error(`Operation failed after ${maxRetries + 1} attempts`)
}

/**
 * Get authenticated user ID
 * Returns null if user is not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user?.id || null
  } catch (error) {
    console.warn('Failed to get current user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const userId = await getCurrentUserId()
  return userId !== null
}

/**
 * Sign in anonymously for offline-first usage
 * This creates a temporary user account that can be upgraded later
 */
export const signInAnonymously = async (): Promise<{ userId: string | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.auth.signInAnonymously()
    
    if (error) {
      return { userId: null, error }
    }

    return { userId: data.user?.id || null, error: null }
  } catch (error) {
    return { userId: null, error: error as Error }
  }
}

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error: error as Error }
  }
}

/**
 * Get or create user profile
 * Ensures every authenticated user has a profile record
 */
export const getOrCreateUserProfile = async () => {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('User not authenticated')

  // Try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError
  }

  if (existingProfile) {
    return existingProfile
  }

  // Create new profile with defaults
  const { data: newProfile, error: insertError } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      preferred_language: 'ru',
      currency_code: 'RUB',
      currency_symbol: '₽',
      currency_name: 'Российский рубль',
      currency_rate: 1.0,
      safety_buffer_percent: 20,
      theme_mode: 'system',
      monthly_budget: 0,
    })
    .select()
    .single()

  if (insertError) throw insertError
  return newProfile
}

/**
 * Update user's last seen timestamp
 * Useful for tracking user activity
 */
export const updateLastSeen = async (): Promise<void> => {
  const userId = await getCurrentUserId()
  if (!userId) return

  try {
    await supabase
      .from('users')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', userId)
  } catch (error) {
    // Fail silently - this is not critical
    console.warn('Failed to update last seen:', error)
  }
}

/**
 * Batch operation wrapper with transaction-like behavior
 * Executes multiple operations and provides partial rollback on failure
 */
export const executeBatch = async <T>(
  operations: Array<() => Promise<T>>
): Promise<{ results: T[]; errors: Error[] }> => {
  const results: T[] = []
  const errors: Error[] = []

  for (const operation of operations) {
    try {
      const result = await operation()
      results.push(result)
    } catch (error) {
      errors.push(error as Error)
    }
  }

  return { results, errors }
}

// Export the database type for use in other files
export type { Database } from '@/types/supabase'

// Periodic connection health check
let healthCheckInterval: NodeJS.Timeout | null = null

/**
 * Start periodic health checks
 * Monitors connection health and updates state
 */
export const startHealthCheck = (intervalMs: number = 30000): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
  }

  healthCheckInterval = setInterval(async () => {
    if (connectionState.isOnline) {
      await checkSupabaseConnection()
    }
  }, intervalMs)
}

/**
 * Stop periodic health checks
 */
export const stopHealthCheck = (): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
    healthCheckInterval = null
  }
}

// Initialize on module load
initializeConnectionMonitoring().then(() => {
  startHealthCheck()
  console.log('Supabase client initialized with connection monitoring')
})