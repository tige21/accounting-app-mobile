import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageOperation {
  key: string;
  value: string;
}

// Батчинг операций для AsyncStorage
class OptimizedStorage {
  private pendingOperations: StorageOperation[] = [];
  private batchTimeoutId: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 50; // 50ms задержка для батчинга (оптимизировано для лучшей отзывчивости)

  // Асинхронная установка значения с батчингом
  async setItem(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pendingOperations.push({ key, value });
      
      if (this.batchTimeoutId) {
        clearTimeout(this.batchTimeoutId);
      }
      
      this.batchTimeoutId = setTimeout(async () => {
        try {
          await this.executeBatch();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, this.BATCH_DELAY);
    });
  }

  // Выполнение батча операций
  private async executeBatch(): Promise<void> {
    if (this.pendingOperations.length === 0) return;
    
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];
    this.batchTimeoutId = null;
    
    // Используем multiSet для batch операций
    const keyValuePairs: [string, string][] = operations.map(op => [op.key, op.value]);
    await AsyncStorage.multiSet(keyValuePairs);
  }

  // Получение значения (оптимизировано с кешем)
  private cache = new Map<string, { value: string; timestamp: number }>();
  private readonly CACHE_DURATION = 10000; // 10 секунд кеша (увеличено для часто используемых данных)

  async getItem(key: string): Promise<string | null> {
    // Проверяем кеш
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.value;
    }

    const value = await AsyncStorage.getItem(key);
    
    // Кешируем результат
    if (value !== null) {
      this.cache.set(key, { value, timestamp: Date.now() });
    }
    
    return value;
  }

  // Множественное получение значений
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    const result = await AsyncStorage.multiGet(keys);
    return result as [string, string | null][];
  }

  // Удаление значения
  async removeItem(key: string): Promise<void> {
    this.cache.delete(key);
    return AsyncStorage.removeItem(key);
  }

  // Очистка кеша
  clearCache(): void {
    this.cache.clear();
  }

  // Принудительное выполнение всех отложенных операций
  async flush(): Promise<void> {
    if (this.batchTimeoutId) {
      clearTimeout(this.batchTimeoutId);
      await this.executeBatch();
    }
  }
}

// Экспорт singleton экземпляра
export const optimizedStorage = new OptimizedStorage();

// Хук для сжатия данных (простая реализация)
export const compressData = (data: string): string => {
  try {
    // Простое сжатие через JSON минификацию
    return JSON.stringify(JSON.parse(data));
  } catch {
    return data;
  }
};

export const decompressData = (data: string): string => {
  return data; // В данном случае просто возвращаем как есть
};

// Оптимизированные методы для Zustand middleware
export const createOptimizedJSONStorage = () => ({
  getItem: async (name: string) => {
    const value = await optimizedStorage.getItem(name);
    return value ? JSON.parse(decompressData(value)) : null;
  },
  setItem: async (name: string, value: any) => {
    const compressed = compressData(JSON.stringify(value));
    return optimizedStorage.setItem(name, compressed);
  },
  removeItem: async (name: string) => {
    return optimizedStorage.removeItem(name);
  }
});