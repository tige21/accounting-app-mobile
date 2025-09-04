import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';
import { ThemeColors } from '@/constants/Colors';

/**
 * Hook для создания динамических стилей на основе текущей темы
 * Позволяет создавать стили, которые автоматически адаптируются к смене темы
 * 
 * @param styleCreator - Функция, принимающая цвета темы и возвращающая объект стилей
 * @returns Объект стилей, созданный StyleSheet.create
 * 
 * @example
 * const styles = useDynamicStyles((colors) => ({
 *   container: {
 *     backgroundColor: colors.background,
 *     borderColor: colors.border,
 *   },
 *   text: {
 *     color: colors.textPrimary,
 *   }
 * }));
 */
export function useDynamicStyles<T>(
  styleCreator: (colors: typeof ThemeColors.light) => T
): T {
  const { theme } = useTheme();
  const themeColors = ThemeColors[theme];

  return useMemo(() => {
    const rawStyles = styleCreator(themeColors);
    return StyleSheet.create(rawStyles) as T;
  }, [theme, themeColors]);
}

/**
 * Hook для получения конкретного цвета из текущей темы
 * Более производительная альтернатива useThemeColor для простых случаев
 * 
 * @param colorKey - Ключ цвета из ThemeColors
 * @returns Значение цвета для текущей темы
 * 
 * @example
 * const backgroundColor = useThemeColorValue('background');
 * const textColor = useThemeColorValue('textPrimary');
 */
export function useThemeColorValue(
  colorKey: keyof typeof ThemeColors.light
): string {
  const { theme } = useTheme();
  return ThemeColors[theme][colorKey];
}

/**
 * Hook для создания адаптивных стилей с условиями на основе темы
 * Полезен для случаев, когда нужны разные стили для разных тем
 * 
 * @param lightStyles - Стили для светлой темы
 * @param darkStyles - Стили для темной темы
 * @returns Объект стилей для текущей темы
 * 
 * @example
 * const styles = useConditionalStyles(
 *   // Light theme styles
 *   {
 *     shadow: { shadowOpacity: 0.1 },
 *   },
 *   // Dark theme styles
 *   {
 *     shadow: { shadowOpacity: 0.3 },
 *   }
 * );
 */
export function useConditionalStyles<T>(
  lightStyles: T,
  darkStyles: T
): T {
  const { isDark } = useTheme();
  
  return useMemo(() => {
    const rawStyles = isDark ? darkStyles : lightStyles;
    return StyleSheet.create(rawStyles as any) as T;
  }, [isDark, lightStyles, darkStyles]);
}

/**
 * Утилитная функция для создания цвета с прозрачностью
 * Работает с hex цветами и добавляет альфа-канал
 * 
 * @param color - Hex цвет (например, '#FF0000')
 * @param opacity - Прозрачность от 0 до 1
 * @returns Цвет с прозрачностью в формате rgba
 * 
 * @example
 * const semiTransparentRed = addOpacity('#FF0000', 0.5);
 */
export function addOpacity(color: string, opacity: number): string {
  // Удаляем # если есть
  const hex = color.replace('#', '');
  
  // Парсим RGB компоненты
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Hook для создания стилей с поддержкой разных уровней elevation/shadow
 * в зависимости от темы
 * 
 * @param elevation - Уровень возвышения (0-5)
 * @returns Объект со стилями shadow для текущей темы
 */
export function useElevationStyles(elevation: number = 1) {
  const { isDark } = useTheme();
  
  return useMemo(() => {
    const shadowOpacity = isDark ? 0.3 : 0.1;
    const shadowRadius = elevation * 2;
    const shadowOffset = { width: 0, height: elevation };
    
    return StyleSheet.create({
      shadow: {
        shadowColor: '#000000',
        shadowOffset,
        shadowOpacity,
        shadowRadius,
        elevation: elevation * 2, // Для Android
      }
    });
  }, [isDark, elevation]);
}