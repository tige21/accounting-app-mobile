// Export all services for easy importing
export { BaseService } from './BaseService'
export { TaskService, taskService } from './TaskService'
export { MigrationService, migrationService } from './MigrationService'

// Service types
export type {
  MigrationOptions,
  MigrationResult,
  MigrationError,
  MigrationProgress
} from './MigrationService'