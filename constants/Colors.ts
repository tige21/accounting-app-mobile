// const tintColorLight = '#2f95dc'
// const tintColorDark = '#fff'

export default {
	white: '#ffffff', //белый (фон)
	black: '#333333', //черный для текста (баланс)
	grey_1: '#969696', //серый (проценты)
	grey_2: '#989FAC', //темно-серый (неактивные иконки в таббаре)
	blue: '#007AFF', //синий основной (выбранная иконка в таббаре)
	blue_1: '#64AEFF', //голубой дополнительный (свитч для темы)
	blue_2: '#BCDCFF', //светлый голубой (фон иконки плюса в таббаре)
	red_1: '#FF4A4A', //кнопка удалить

	//КАТЕГОРИИ ТРАТ
	red_2: '#FE6F7B', //здоровье
	green_1: '#77E3B5', //красота
	yellow: '#FFC047', //кафе
	pink_1: '#F584FF', //продукты
	blue_3: '#69BFFE', //транспорт
	violet_1: '#6871FC', //образование
	violet_2: '#9E73FC', //развлечения
	green_2: '#93E850', //дом
	orange: '#E69154', //животные
	blue_4: '#4269CB', //переводы
	grey_3: '#BFBFBF', //другое

	//КАТЕГОРИИ ДОХОДОВ
	brown: '#C99B82', //пассивный доход
	green_3: '#82C992', //зарплата
	blue_5: '#829AC9', //аванс
	pink_2: '#C982C6', //кэшбек
	red_3: '#C98282', //подарок
	blue_6: '#82C5C9', //акции
	violet_3: '#9082C9' //фриланс
}

/**
 * StudyFlow Color System - Phase 3 Design Implementation
 * Learning-optimized colors for distraction-free studying
 */

const tintColorLight = '#4A90E2'; // Updated to StudyFlow primary blue
const tintColorDark = '#5AA3F0';

export const ThemeColors = {
  light: {
    // Base theme colors
    text: '#2C3E50',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6C7B7F',
    tabIconDefault: '#6C7B7F',
    tabIconSelected: tintColorLight,
    
    // Primary colors
    primary: '#007AFF',      // iOS blue
    primaryLight: '#64AEFF',
    primaryDark: '#0056CC',
    
    secondary: '#7B68EE',    
    secondaryLight: '#9985F2',
    secondaryDark: '#6B5CE6',
    
    // Status colors
    success: '#34C759',      
    successLight: '#7CC77C',
    successBackground: '#F0F8F0',
    
    warning: '#FF9500',      
    warningLight: '#FFB84D',
    warningBackground: '#FDF8F0',
    
    error: '#FF3B30',        
    errorLight: '#FF6B60',
    errorBackground: '#FDF2F2',
    
    // UI structure colors
    surface: '#FFFFFF',
    surfaceSecondary: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F1F3F4',
    
    // Text hierarchy
    textPrimary: '#000000',
    textSecondary: '#6C7B7F',
    textTertiary: '#95A5A6',
    textDisabled: '#C7C7CC',
    
    // Interactive states
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#000000',
    
    // Borders & Separators
    border: '#E5E7EB',
    borderLight: '#F0F0F0',
    borderActive: '#007AFF',
    separator: '#C6C6C8',
    
    // Shadows & Overlays
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowLight: 'rgba(0, 0, 0, 0.04)',
    shadowDark: 'rgba(0, 0, 0, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    
    // Card & Surface variations
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    
    // Input & Form elements
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E7EB',
    inputText: '#000000',
    inputPlaceholder: '#8E8E93',
    
    // Navigation & Tabs
    tabBar: '#F8F9FA',
    tabBarBorder: '#C6C6C8',
    
    // Specialty colors for app features
    expense: '#FF3B30',
    income: '#34C759',
    neutral: '#8E8E93',
  },
  dark: {
    // Base theme colors - Pure black background like Ellie
    text: '#FFFFFF',
    background: '#000000',        // Pure black background
    tint: tintColorDark,
    icon: '#B0B3B8',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#0A84FF',
    
    // Primary colors
    primary: '#0A84FF',      // iOS dark mode blue
    primaryLight: '#64AEFF',
    primaryDark: '#0056CC',
    
    secondary: '#9B8AF5',
    secondaryLight: '#B5A8F8',
    secondaryDark: '#8A7BF2',
    
    // Status colors
    success: '#30D158',
    successLight: '#85D999',
    successBackground: '#0A2A0A',
    
    warning: '#FF9F0A',
    warningLight: '#FFD085',
    warningBackground: '#2A1F0A',
    
    error: '#FF453A',
    errorLight: '#FF8E8E',
    errorBackground: '#2A0A0A',
    
    // UI structure colors
    surface: '#1C1C1E',          // Dark gray cards
    surfaceSecondary: '#2C2C2E', // Slightly lighter for elevated content
    surfaceElevated: '#2C2C2E',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',
    
    // Text hierarchy - White headers, gray body text
    textPrimary: '#FFFFFF',      // White for headers
    textSecondary: '#B0B3B8',    // Light gray for body text
    textTertiary: '#8E8E93',     // Medium gray for secondary text
    textDisabled: '#48484A',     // Dark gray for disabled
    
    // Interactive states
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#FFFFFF',
    
    // Borders & Separators
    border: '#38383A',
    borderLight: '#48484A',
    borderActive: '#0A84FF',
    separator: '#38383A',
    
    // Shadows & Overlays
    shadow: 'rgba(0, 0, 0, 0.5)',
    shadowLight: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    
    // Card & Surface variations
    card: '#1C1C1E',
    cardElevated: '#2C2C2E',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    
    // Input & Form elements
    inputBackground: '#1C1C1E',
    inputBorder: '#38383A',
    inputText: '#FFFFFF',
    inputPlaceholder: '#8E8E93',
    
    // Navigation & Tabs
    tabBar: '#1C1C1E',
    tabBarBorder: '#38383A',
    
    // Specialty colors for app features
    expense: '#FF453A',
    income: '#30D158',
    neutral: '#8E8E93',
  },
};
