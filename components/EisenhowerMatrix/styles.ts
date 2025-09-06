import { StyleSheet } from 'react-native'

export const matrixStyles = StyleSheet.create({
  // Анимации для drag & drop
  dragGlow: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  dropZoneActive: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    transform: [{ scale: 1.02 }],
  },
  dropZoneAccepting: {
    borderColor: '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    transform: [{ scale: 1.05 }],
  },
  
  // Градиенты для квадрантов
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.05,
  },
  
  // Пульсирующие эффекты
  pulseContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pulsing: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Индикаторы приоритета
  priorityHigh: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  priorityMedium: {
    backgroundColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  priorityLow: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  // Floating элементы
  floatingButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Переходные анимации
  fadeIn: {
    opacity: 0,
  },
  fadeInActive: {
    opacity: 1,
  },
  slideUp: {
    transform: [{ translateY: 20 }],
  },
  slideUpActive: {
    transform: [{ translateY: 0 }],
  },
  
  // Hover эффекты для touch
  touchableHighlight: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  
  // Статусные индикаторы
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 12,
  },
  completedCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  
  // Текстовые эффекты
  glowText: {
    textShadowColor: 'rgba(0, 122, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  
  // Карточки с улучшенными тенями
  enhancedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderRadius: 16,
  },
  enhancedCardHovered: {
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    transform: [{ translateY: -2 }],
  },
})

// Константы для анимаций
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
}

export const SPRING_CONFIGS = {
  gentle: {
    damping: 20,
    stiffness: 300,
  },
  bouncy: {
    damping: 12,
    stiffness: 200,
  },
  snappy: {
    damping: 25,
    stiffness: 400,
  },
}

// Цвета с альфа каналами для различных состояний
export const ALPHA_COLORS = {
  overlay: 'rgba(0, 0, 0, 0.4)',
  highlight: 'rgba(0, 122, 255, 0.1)',
  success: 'rgba(52, 199, 89, 0.1)',
  warning: 'rgba(255, 149, 0, 0.1)',
  error: 'rgba(255, 59, 48, 0.1)',
  disabled: 'rgba(142, 142, 147, 0.3)',
}