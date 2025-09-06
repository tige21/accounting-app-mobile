import React from 'react'
import { View, ScrollView } from 'react-native'
import { ThemedText, ThemedView } from '@/components'
import { EisenhowerItem, EisenhowerQuadrantConfig, EisenhowerQuadrant } from '@/types/eisenhower'
import DraggableMatrixItem from './DraggableMatrixItem'

interface MatrixQuadrantProps {
  config: EisenhowerQuadrantConfig
  items: EisenhowerItem[]
  onItemPress: (item: EisenhowerItem) => void
  onItemLongPress: (item: EisenhowerItem) => void
  onToggleComplete: (item: EisenhowerItem) => void
  onDragStart: (item: EisenhowerItem) => void
  onDragEnd: () => void
  onDropInQuadrant: (item: EisenhowerItem, quadrant: EisenhowerQuadrant) => void
  onQuadrantEnter?: (quadrant: EisenhowerQuadrant) => void
  onQuadrantExit?: () => void
  isDragTarget?: boolean
  draggedItem?: EisenhowerItem | null
}

export default function MatrixQuadrant({
  config,
  items,
  onItemPress,
  onItemLongPress,
  onToggleComplete,
  onDragStart,
  onDragEnd,
  onDropInQuadrant,
  onQuadrantEnter,
  onQuadrantExit,
  isDragTarget = false,
  draggedItem
}: MatrixQuadrantProps) {
  // Определяем, является ли этот квадрант целью для перетаскивания
  const isDropTarget = draggedItem && isDragTarget
  
  return (
    <ThemedView
      className={`flex-1 border-2 rounded-2xl p-3 m-1 min-h-[200px] ${
        isDropTarget ? 'border-4 bg-blue-500/20' : ''
      }`}
      style={{
        backgroundColor: isDropTarget ? config.backgroundColor + '40' : config.backgroundColor,
        borderColor: isDropTarget ? config.color : config.borderColor,
        overflow: 'visible'
      }}
      onLayout={() => {
        // Квадрант готов для drag operations
      }}
    >
      {/* Заголовок квадранта */}
      <View className="items-center mb-3 pb-2 border-b border-black/10">
        <ThemedText 
          type="defaultSemiBold" 
          className="text-sm font-semibold text-center mb-0.5"
          style={{ color: config.color }}
        >
          {config.title}
        </ThemedText>
        <ThemedText 
          type="caption" 
          className="text-xs text-center mb-1.5"
          style={{ color: config.color, opacity: 0.8 }}
        >
          {config.subtitle}
        </ThemedText>
        <View 
          className="px-2 py-0.5 rounded-xl min-w-6 items-center"
          style={{ backgroundColor: config.color + '20' }}
        >
          <ThemedText 
            type="caption" 
            className="text-xs font-semibold"
            style={{ color: config.color }}
          >
            {items.length}
          </ThemedText>
        </View>
      </View>

      {/* Список элементов */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        style={{ overflow: 'visible' }}
      >
        {items.map((item, index) => (
          <DraggableMatrixItem
            key={`${item.id}-${index}`}
            item={item}
            onPress={() => onItemPress(item)}
            onLongPress={() => onItemLongPress(item)}
            onToggleComplete={() => onToggleComplete(item)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDropInQuadrant={onDropInQuadrant}
            quadrantColor={config.color}
          />
        ))}
        
        {items.length === 0 && (
          <View className="flex-1 items-center justify-center py-5">
            <ThemedText 
              type="caption" 
              className="text-xs italic"
              style={{ color: config.color, opacity: 0.5 }}
            >
              Нет задач
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  )
}

