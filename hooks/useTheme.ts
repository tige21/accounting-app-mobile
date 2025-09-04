import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Hook для получения текущей темы с учетом настроек пользователя
 * Возвращает 'light' или 'dark' на основе:
 * - Системной темы (если выбрано 'system')
 * - Пользовательского выбора (если выбрано 'light' или 'dark')
 */
export function useTheme() {
  const { themeMode } = useSettingsStore();
  const systemColorScheme = useColorScheme();

  // Определяем активную тему
  const activeTheme = themeMode === 'system' 
    ? (systemColorScheme ?? 'light')
    : themeMode;

  return {
    theme: activeTheme,
    themeMode,
    isDark: activeTheme === 'dark',
    isLight: activeTheme === 'light',
  };
}