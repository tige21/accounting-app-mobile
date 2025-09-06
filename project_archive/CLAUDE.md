# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "wallet Watch" (walletwatch) - a React Native mobile application built with Expo for financial tracking and task management. The app provides comprehensive expense/income tracking, analytics, task scheduling, and note-taking capabilities.

**Key Technologies:**
- React Native with Expo SDK 53
- TypeScript with strict mode
- Expo Router for file-based navigation
- Zustand for state management with AsyncStorage persistence
- @tanstack/react-query for data fetching
- i18next for internationalization (Russian/English)

## Development Commands

```bash
# Start development server
expo start

# Run on specific platforms
expo run:android
expo run:ios
expo start --web

# Run tests
jest --watchAll
```

## Architecture & Project Structure

### Core Directories

- **`/app`** - Expo Router pages with tab-based navigation structure
  - `(tabs)/` - Main tab screens (analytics, tasks, expenses, statistics)
  - Root level screens (transaction, profile, task-details, etc.)

- **`/store`** - Zustand stores with AsyncStorage persistence
  - `transactionStore.ts` - Financial transactions management
  - `taskStore.ts` - Task scheduling with automatic cleanup
  - `noteStore.ts` - Note-taking functionality
  - `settingsStore.ts` - App settings and currency rates
  - `financeStore.ts` - Financial calculations and budgeting

- **`/components`** - Reusable UI components
  - Modular bottom sheet modals for various inputs
  - Category selectors with custom SVG icons
  - Animated components using React Native Reanimated
  - Form components with consistent styling

- **`/services`** - API layer and external integrations
  - `api.ts` - Axios instance configured for localhost:8081
  - `types/` - TypeScript type definitions

- **`/features/hooks`** - Custom React hooks
  - `useCurrencyRates` - Currency conversion functionality
  - `useUserId` - User identification management
  - Animation and navigation hooks

- **`/constants`** - Static configuration
  - `Colors.ts` - Comprehensive color palette for categories
  - `data.ts` - Static data structures
  - `enums.ts` - TypeScript enums
  - `i18n/` - Internationalization configuration

### State Management Patterns

The app uses Zustand with persistence middleware:

```typescript
// All stores follow this pattern
export const useTransactionStore = create<StoreType>()(
  persist(
    (set, get) => ({
      // store logic
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

### Navigation Structure

File-based routing with Expo Router:
- Tab navigation with 5 tabs including animated center button
- Stack navigation for detail screens
- Custom animated transitions and gestures

### Category System

The app includes comprehensive category icons and colors:
- **Expenses**: Health, Beauty, Restaurants, Groceries, Transport, Education, Entertainment, Housing, Pets, Transfers, Other
- **Incomes**: Passive Income, Salary, Advance, Cashback, Gifts, Stocks, Freelance

Each category has associated colors defined in `constants/Colors.ts` and SVG icons in `assets/svg/`.

### Key Features

1. **Financial Tracking**
   - Income/expense transactions with categories
   - Multi-currency support with live exchange rates
   - Monthly/yearly analytics with charts
   - Budget management and spending limits

2. **Task Management**
   - Scheduled tasks with notifications
   - Automatic cleanup of completed tasks
   - Repeat functionality for recurring tasks

3. **Data Persistence**
   - All user data stored locally with AsyncStorage
   - Automatic data migration and backup
   - Offline-first approach

4. **Internationalization**
   - Russian and English language support
   - Automatic locale detection
   - Persistent language preferences

## Development Guidelines

### Path Aliases
Use the `@/*` alias for imports:
```typescript
import { useTransactionStore } from '@/store/transactionStore'
import Colors from '@/constants/Colors'
```

### Component Patterns
- Use TypeScript interfaces for props
- Follow the existing folder structure for new components
- Implement proper loading states and error handling
- Use React Native Reanimated for animations

### State Updates
- Use Zustand stores for global state
- Persist important data with AsyncStorage middleware
- Follow immutable update patterns

### Styling
- Use the established color palette from `constants/Colors.ts`
- Follow existing spacing and typography patterns
- Implement responsive design for different screen sizes

### API Integration
- Use @tanstack/react-query for data fetching
- Handle loading states and error scenarios
- Implement proper caching strategies

## Testing

The project uses Jest with `jest-expo` preset. Test files should be placed alongside source files or in `__tests__` directories.

## Notifications

The app implements local notifications for task reminders:
- Uses expo-notifications
- Configured for background scheduling
- Handles permission requests appropriately

## Currency Integration

Live currency rates are fetched and stored in settings store:
- Supports multiple currencies
- Automatic rate updates
- Fallback for offline scenarios