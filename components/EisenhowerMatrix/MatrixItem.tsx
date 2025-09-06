import React from 'react'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { ThemedText, ThemedView } from '@/components'
import { EisenhowerItem } from '@/types/eisenhower'
import { useThemeColor } from '@/hooks/useThemeColor'
import Feather from '@expo/vector-icons/Feather'

interface MatrixItemProps {
  item: EisenhowerItem
  onPress: () => void
  onLongPress: () => void
  onToggleComplete?: (item: EisenhowerItem) => void
  quadrantColor: string
  isDragging?: boolean
}

export default function MatrixItem({
  item,
  onPress,
  onLongPress,
  onToggleComplete,
  quadrantColor,
  isDragging = false
}: MatrixItemProps) {
  const surfaceColor = useThemeColor({}, 'surface')
  const textPrimaryColor = useThemeColor({}, 'textPrimary')
  const textSecondaryColor = useThemeColor({}, 'textSecondary')
  const primaryColor = useThemeColor({}, 'primary')

  const priorityColor = getPriorityColor(item.priority)
  
  const handleCheckboxPress = (e: any) => {
    e.stopPropagation()
    if (onToggleComplete) {
      onToggleComplete(item)
    }
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-row items-center rounded-lg mb-1.5 p-2 min-h-12 shadow-sm"
      style={({ pressed }) => ({
        backgroundColor: surfaceColor,
        opacity: isDragging ? 0.7 : pressed ? 0.8 : item.isCompleted ? 0.6 : 1,
        transform: [{ scale: isDragging ? 1.05 : pressed ? 0.98 : 1 }],
      })}
    >
      {/* Чекбокс */}
      {/* <TouchableOpacity 
        onPress={handleCheckboxPress}
        className="w-4.5 h-4.5 rounded-full border-2 mr-2 items-center justify-center"
        style={{
          borderColor: primaryColor,
          backgroundColor: item.isCompleted ? primaryColor : 'transparent'
        }}
      >
        {item.isCompleted && (
          <Feather name="check" size={12} color="white" />
        )}
      </TouchableOpacity> */}

      {/* Индикатор приоритета */}
      <View 
        className="w-0.5 rounded-full mr-1.5 min-h-8"
        style={{ backgroundColor: priorityColor }} 
      />

      <View className="flex-1">
        {/* Заголовок */}
        <ThemedText 
          type="defaultSemiBold" 
          className="text-sm font-semibold mb-0.5"
          style={[
            { color: textPrimaryColor },
            item.isCompleted && { textDecorationLine: 'line-through', opacity: 0.6 }
          ]}
          numberOfLines={1}
        >
          {item.title}
        </ThemedText>

        {/* Компактная метаинформация */}
        <View className="flex-row items-center gap-2">
          {/* Приоритет */}
          <View className="flex-row items-center">
            <View className="w-1 h-1 rounded-full mr-0.5" style={{ backgroundColor: priorityColor }} />
            <ThemedText 
              type="caption" 
              className="text-xs font-medium"
              style={{ color: textSecondaryColor }}
            >
              {item.priority}
            </ThemedText>
          </View>

          {/* Длительность */}
          {item.estimatedDuration && (
            <ThemedText 
              type="caption" 
              className="text-xs font-medium"
              style={{ color: textSecondaryColor }}
            >
              {item.estimatedDuration}м
            </ThemedText>
          )}

          {/* Индикатор связи */}
          {(item.taskId || item.noteId) && (
            <View className="w-1 h-1 rounded-full" style={{ backgroundColor: quadrantColor }} />
          )}
        </View>
      </View>

      {/* Drag handle */}
      <View className="justify-center items-center w-4 h-4 gap-0.5 ml-1">
        <View className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: textSecondaryColor }} />
        <View className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: textSecondaryColor }} />
        <View className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: textSecondaryColor }} />
      </View>
    </Pressable>
  )
}

function getPriorityColor(priority: number): string {
  if (priority >= 9) return '#FF3B30'      // Высокий - красный
  if (priority >= 7) return '#FF9500'      // Средне-высокий - оранжевый  
  if (priority >= 5) return '#FFCC00'      // Средний - желтый
  if (priority >= 3) return '#34C759'      // Низкий-средний - зеленый
  return '#8E8E93'                         // Низкий - серый
}

