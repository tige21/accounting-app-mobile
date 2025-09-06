# Supabase Integration Guide

Ваше приложение WalletWatch теперь интегрировано с Supabase для синхронизации данных в облаке.

## 🚀 Что реализовано

### ✅ **Phase 1 - Foundation Setup** (ЗАВЕРШЕНО)

1. **Установка зависимостей**
   - @supabase/supabase-js
   - Конфигурация окружения

2. **Базовые сервисы**
   - `lib/supabase.ts` - Клиент Supabase с offline-first конфигурацией
   - `services/BaseService.ts` - Базовый класс для всех сервисов
   - `services/TaskService.ts` - Полный CRUD для задач с автоматическим синхронизацией

3. **Миграция данных**
   - `services/MigrationService.ts` - Сервис для переноса данных из AsyncStorage в Supabase
   - Автоматическое резервное копирование перед миграцией
   - Progress tracking и восстановление при ошибках

4. **Обновленный TaskStore**
   - Интеграция с Supabase сервисами
   - Offline-first подход сохранен
   - Автоматическая синхронизация при сетевом подключении
   - Методы для миграции и состояния синхронизации

## 📋 **Настройка для использования**

### 1. Создание Supabase проекта

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Выполните SQL скрипт из `supabase/schema.sql`
4. Примените политики безопасности из `supabase/rls-policies.sql`

### 2. Конфигурация приложения

1. Скопируйте `.env.example` в `.env.local`
2. Заполните переменные из вашего Supabase проекта:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Использование в приложении

Ваш существующий код будет работать без изменений! TaskStore автоматически:

- Сохраняет данные локально (как раньше)
- Синхронизирует с Supabase при наличии интернета
- Работает офлайн с автоматической синхронизацией при восстановлении связи

## 🔄 **Миграция существующих данных**

Для пользователей с существующими данными:

```typescript
import { useTaskStore } from '@/store/taskStore'

// В компоненте или при первом запуске
const { startMigration, getMigrationStatus, syncState } = useTaskStore()

// Запуск миграции
await startMigration()

// Проверка статуса
const isInProgress = getMigrationStatus()
const { isLoading, syncError, lastSyncTime } = syncState
```

## 📊 **Мониторинг синхронизации**

```typescript
import { useTaskStore } from '@/store/taskStore'

const TaskSyncStatus = () => {
  const { syncState, syncTasks } = useTaskStore()
  
  return (
    <View>
      <Text>Статус: {syncState.isOnline ? 'Онлайн' : 'Офлайн'}</Text>
      <Text>Последняя синхронизация: {syncState.lastSyncTime}</Text>
      {syncState.hasPendingSync && (
        <Text>Есть несинхронизированные изменения</Text>
      )}
      <Button title="Синхронизировать" onPress={syncTasks} />
    </View>
  )
}
```

## 🛠️ **Архитектура**

### Offline-First подход
- Все операции сначала выполняются локально
- Синхронизация происходит в фоне
- При отсутствии интернета данные попадают в очередь
- Автоматическое восстановление связи и повтор операций

### Безопасность
- Row Level Security (RLS) для изоляции данных пользователей
- Анонимная аутентификация для offline-first
- Аудит всех изменений данных

### Масштабируемость
- Батчевая обработка больших объемов данных
- Пагинация и оптимизированные запросы
- Готовность к добавлению новых типов данных

## 🚧 **Следующие шаги (TODO)**

1. **Phase 2**: Реализация синхронизации для транзакций
2. **Phase 3**: Синхронизация заметок и блокнотов
3. **Phase 4**: Синхронизация Eisenhower матрицы
4. **Phase 5**: Улучшения UX (индикаторы загрузки, статус синхронизации)
5. **Phase 6**: Collaborative features (общий доступ к задачам)

## 🆘 **Troubleshooting**

### Проблемы с подключением
```typescript
import { taskService } from '@/services/TaskService'

// Проверка соединения
const connectionState = await taskService.checkConnection()
console.log('Supabase доступен:', connectionState.isConnectedToSupabase)
```

### Восстановление из резервной копии
```typescript
import { migrationService } from '@/services/MigrationService'

// Получение доступных резервных копий
const backups = await migrationService.getAvailableBackups()

// Восстановление
await migrationService.restoreFromBackup(backups[0])
```

### Валидация после миграции
```typescript
const validation = await migrationService.validateMigration()
if (!validation.isValid) {
  console.log('Проблемы:', validation.issues)
}
```

## 🎯 **Ключевые преимущества**

1. **Сохранен существующий UX** - приложение работает точно так же
2. **Синхронизация между устройствами** - данные доступны везде  
3. **Offline-first** - работает без интернета
4. **Безопасность данных** - enterprise-grade защита
5. **Автоматические бэкапы** - защита от потери данных
6. **Готовность к росту** - легко масштабируется

Ваше приложение теперь готово к облачной синхронизации! 🎉