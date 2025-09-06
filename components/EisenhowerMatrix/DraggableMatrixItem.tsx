import React, { useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { EisenhowerItem, EisenhowerQuadrant } from '@/types/eisenhower'
import MatrixItem from './MatrixItem'
import { SPRING_CONFIGS } from './styles'

interface DraggableMatrixItemProps {
  item: EisenhowerItem
  onPress: () => void
  onLongPress: () => void
  onToggleComplete?: (item: EisenhowerItem) => void
  onDragStart: (item: EisenhowerItem) => void
  onDragEnd: () => void
  onDropInQuadrant: (item: EisenhowerItem, quadrant: EisenhowerQuadrant) => void
  quadrantColor: string
}

export default function DraggableMatrixItem({
  item,
  onPress,
  onLongPress,
  onToggleComplete,
  onDragStart,
  onDragEnd,
  onDropInQuadrant,
  quadrantColor
}: DraggableMatrixItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  // Анимационные значения
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)
  const opacity = useSharedValue(1)
  const shadowRadius = useSharedValue(4)
  const shadowOpacity = useSharedValue(0.1)

  const handleDragStart = () => {
    setIsDragging(true)
    onDragStart(item)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    onDragEnd()
  }

  // Жест перетаскивания
  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(handleDragStart)()
    })
    .onUpdate((event) => {
      translateX.value = event.translationX
      translateY.value = event.translationY
      
      // Улучшенная анимация во время перетаскивания
      scale.value = withSpring(1.05, SPRING_CONFIGS.bouncy)
      rotation.value = withSpring(
        interpolate(event.translationX, [-100, 0, 100], [-3, 0, 3]),
        SPRING_CONFIGS.gentle
      )
      opacity.value = withSpring(0.85, SPRING_CONFIGS.snappy)
      shadowRadius.value = withSpring(12, SPRING_CONFIGS.gentle)
      shadowOpacity.value = withSpring(0.25, SPRING_CONFIGS.gentle)
    })
    .onEnd((event) => {
      // Определяем направление движения для простого drop detection
      const { translationX, translationY } = event
      const dragDistance = Math.abs(translationX) + Math.abs(translationY)
      
      // Если было значительное перетаскивание, пытаемся определить целевой квадрант
      if (dragDistance > 50) {
        // Простая логика определения квадранта по направлению
        let targetQuadrant = item.quadrant
        
        if (Math.abs(translationX) > Math.abs(translationY)) {
          // Горизонтальное движение
          if (translationX > 0) {
            // Движение вправо
            if (item.quadrant === EisenhowerQuadrant.DO_FIRST) targetQuadrant = EisenhowerQuadrant.SCHEDULE
            else if (item.quadrant === EisenhowerQuadrant.DELEGATE) targetQuadrant = EisenhowerQuadrant.ELIMINATE
          } else {
            // Движение влево
            if (item.quadrant === EisenhowerQuadrant.SCHEDULE) targetQuadrant = EisenhowerQuadrant.DO_FIRST
            else if (item.quadrant === EisenhowerQuadrant.ELIMINATE) targetQuadrant = EisenhowerQuadrant.DELEGATE
          }
        } else {
          // Вертикальное движение
          if (translationY > 0) {
            // Движение вниз
            if (item.quadrant === EisenhowerQuadrant.DO_FIRST) targetQuadrant = EisenhowerQuadrant.DELEGATE
            else if (item.quadrant === EisenhowerQuadrant.SCHEDULE) targetQuadrant = EisenhowerQuadrant.ELIMINATE
          } else {
            // Движение вверх
            if (item.quadrant === EisenhowerQuadrant.DELEGATE) targetQuadrant = EisenhowerQuadrant.DO_FIRST
            else if (item.quadrant === EisenhowerQuadrant.ELIMINATE) targetQuadrant = EisenhowerQuadrant.SCHEDULE
          }
        }
        
        // Уведомляем родительский компонент о drop
        runOnJS(onDropInQuadrant)(item, targetQuadrant as EisenhowerQuadrant)
      }
      
      // Плавное анимированное возвращение в исходное положение
      translateX.value = withSpring(0, SPRING_CONFIGS.snappy)
      translateY.value = withSpring(0, SPRING_CONFIGS.snappy)
      scale.value = withSpring(1, SPRING_CONFIGS.gentle)
      rotation.value = withSpring(0, SPRING_CONFIGS.gentle)
      opacity.value = withSpring(1, SPRING_CONFIGS.gentle)
      shadowRadius.value = withSpring(4, SPRING_CONFIGS.gentle)
      shadowOpacity.value = withSpring(0.1, SPRING_CONFIGS.gentle)
      
      runOnJS(handleDragEnd)()
    })
    .minDistance(10) // Минимальное расстояние для начала перетаскивания

  // Жест длительного нажатия
  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => {
      runOnJS(onLongPress)()
    })

  // Жест обычного тапа
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      runOnJS(onPress)()
    })

  // Комбинирование жестов
  const composedGesture = Gesture.Simultaneous(
    Gesture.Exclusive(longPressGesture, tapGesture),
    panGesture
  )

  // Улучшенные стили анимации с правильным z-index
  const animatedStyle = useAnimatedStyle(() => {
    const isCurrentlyDragging = Math.abs(translateX.value) > 5 || Math.abs(translateY.value) > 5
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
      shadowRadius: shadowRadius.value,
      shadowOpacity: shadowOpacity.value,
      zIndex: isCurrentlyDragging ? 9999 : 1,
      elevation: isCurrentlyDragging ? 9999 : 2,
    }
  })

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[animatedStyle]}>
        <MatrixItem
          item={item}
          onPress={() => {}} // Обрабатывается через жест
          onLongPress={() => {}} // Обрабатывается через жест
          onToggleComplete={onToggleComplete}
          quadrantColor={quadrantColor}
          isDragging={isDragging}
        />
      </Animated.View>
    </GestureDetector>
  )
}


