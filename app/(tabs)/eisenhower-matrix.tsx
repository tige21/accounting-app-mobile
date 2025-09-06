import React, { useState, useCallback, useRef } from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Feather from '@expo/vector-icons/Feather'
import { ThemedView, ThemedText, UserAvatar } from '@/components'
import { MatrixQuadrant, MatrixItemModal } from '@/components/EisenhowerMatrix'
import { useEisenhowerStore, QUADRANT_CONFIGS } from '@/store/eisenhowerStore'
import { EisenhowerItem, EisenhowerQuadrant } from '@/types/eisenhower'
import { useThemeColor } from '@/hooks/useThemeColor'
import * as Haptics from 'expo-haptics'

const Header = React.memo(({ onSync }: { onSync: () => void }) => {
  const syncButtonColor = useThemeColor({}, 'primary')
  
  return (
    <View className="mb-4 gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <UserAvatar />
          <ThemedText type="heading">Матрица Эйзенхауэра</ThemedText>
        </View>
        
        <TouchableOpacity
          onPress={onSync}
          className="p-2.5 rounded-xl border items-center justify-center"
          style={{ borderColor: syncButtonColor + '40' }}
        >
          <Feather name="refresh-cw" size={18} color={syncButtonColor} />
        </TouchableOpacity>
      </View>
      <ThemedText type="secondary" className="text-sm opacity-70">
        Управляйте приоритетами эффективно
      </ThemedText>
    </View>
  )
})

const MatrixStats = React.memo(() => {
  const { getMatrixStats } = useEisenhowerStore()
  const stats = getMatrixStats()
  const primaryColor = useThemeColor({}, 'primary')

  return (
    <ThemedView colorName="surface" className="flex-row p-4 rounded-2xl mb-5 justify-around">
      <View className="items-center">
        <ThemedText type="caption" className="text-xs mb-1 opacity-70">Всего</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-lg font-semibold" style={{ color: primaryColor }}>
          {stats.totalItems}
        </ThemedText>
      </View>
      <View className="items-center">
        <ThemedText type="caption" className="text-xs mb-1 opacity-70">Завершено</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-lg font-semibold text-green-500">
          {stats.completedItems}
        </ThemedText>
      </View>
      <View className="items-center">
        <ThemedText type="caption" className="text-xs mb-1 opacity-70">Прогресс</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-lg font-semibold text-orange-500">
          {Math.round(stats.completionRate)}%
        </ThemedText>
      </View>
    </ThemedView>
  )
})

export default function EisenhowerMatrixScreen() {
  const [selectedItem, setSelectedItem] = useState<EisenhowerItem | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalQuadrant, setModalQuadrant] = useState<EisenhowerQuadrant>(EisenhowerQuadrant.DO_FIRST)
  const [draggedItem, setDraggedItem] = useState<EisenhowerItem | null>(null)
  const [targetQuadrant, setTargetQuadrant] = useState<EisenhowerQuadrant | null>(null)

  const { items, getItemsByQuadrant, moveItem, updateItem, syncWithTasks, syncWithNotes } = useEisenhowerStore()
  const addButtonColor = useThemeColor({}, 'primary')
  const onPrimaryColor = useThemeColor({}, 'onPrimary')

  const modalRef = useRef<BottomSheetModal>(null)

  const handleItemPress = useCallback((item: EisenhowerItem) => {
    if (!draggedItem) {
      setSelectedItem(item)
      setIsModalVisible(true)
    }
  }, [draggedItem])

  const handleItemLongPress = useCallback((item: EisenhowerItem) => {
    if (!draggedItem) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      
      Alert.alert(
        'Действия с задачей',
        item.title,
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Редактировать',
            onPress: () => {
              setSelectedItem(item)
              setIsModalVisible(true)
            }
          },
          {
            text: 'Переместить',
            onPress: () => showMoveDialog(item)
          },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: () => confirmDelete(item)
          }
        ]
      )
    }
  }, [draggedItem])

  const handleDragStart = useCallback((item: EisenhowerItem) => {
    setDraggedItem(item)
  }, [])

  const handleDragEnd = useCallback(() => {
    // Сброс состояний после завершения drag
    setDraggedItem(null)
    setTargetQuadrant(null)
  }, [])

  const handleDropInQuadrant = useCallback((item: EisenhowerItem, quadrant: EisenhowerQuadrant) => {
    if (quadrant !== item.quadrant) {
      moveItem(item.id, quadrant)
      console.log(`Moving item "${item.title}" from ${item.quadrant} to ${quadrant}`)
    }
  }, [moveItem])

  const handleQuadrantEnter = useCallback((quadrant: EisenhowerQuadrant) => {
    if (draggedItem && quadrant !== draggedItem.quadrant) {
      setTargetQuadrant(quadrant)
    }
  }, [draggedItem])

  const handleQuadrantExit = useCallback(() => {
    setTargetQuadrant(null)
  }, [])

  const handleToggleComplete = useCallback((item: EisenhowerItem) => {
    updateItem(item.id, { 
      isCompleted: !item.isCompleted,
      completedAt: !item.isCompleted ? new Date().toISOString() : undefined
    })
    
    // Синхронизировать с задачами/заметками если связано
    if (item.taskId) {
      useEisenhowerStore.getState().syncToTasks(item)
    }
    if (item.noteId) {
      useEisenhowerStore.getState().syncToNotes(item)
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [updateItem])

  const showMoveDialog = (item: EisenhowerItem) => {
    const quadrantOptions = Object.values(EisenhowerQuadrant)
      .filter(q => q !== item.quadrant)
      .map(quadrant => ({
        text: QUADRANT_CONFIGS[quadrant].title,
        onPress: () => {
          moveItem(item.id, quadrant)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
      }))

    Alert.alert(
      'Переместить в',
      'Выберите новый квадрант',
      [
        { text: 'Отмена', style: 'cancel' },
        ...quadrantOptions
      ]
    )
  }

  const confirmDelete = (item: EisenhowerItem) => {
    Alert.alert(
      'Удалить задачу?',
      'Это действие нельзя отменить',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            useEisenhowerStore.getState().deleteItem(item.id)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          }
        }
      ]
    )
  }

  const handleAddItem = (quadrant: EisenhowerQuadrant) => {
    setSelectedItem(null)
    setModalQuadrant(quadrant)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedItem(null)
  }

  const handleSync = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    syncWithTasks()
    syncWithNotes()
    
    Alert.alert(
      'Синхронизация завершена',
      'Задачи и заметки синхронизированы с матрицей',
      [{ text: 'OK' }]
    )
  }, [syncWithTasks, syncWithNotes])

  const renderQuadrant = (quadrant: EisenhowerQuadrant) => {
    const config = QUADRANT_CONFIGS[quadrant]
    const quadrantItems = getItemsByQuadrant(quadrant)

    return (
      <View key={quadrant} className="flex-1 relative">
        <MatrixQuadrant
          config={config}
          items={quadrantItems}
          onItemPress={handleItemPress}
          onItemLongPress={handleItemLongPress}
          onToggleComplete={handleToggleComplete}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDropInQuadrant={handleDropInQuadrant}
          onQuadrantEnter={handleQuadrantEnter}
          onQuadrantExit={handleQuadrantExit}
          isDragTarget={targetQuadrant === quadrant}
          draggedItem={draggedItem}
        />
      </View>
    )
  }

  return (
    <ThemedView colorName="background" className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-5 pb-24">
          {/* Заголовок */}
          <Header onSync={handleSync} />
          
          {/* Статистика */}
          <MatrixStats />

          {/* Сетка матрицы 2x2 */}
          <View className="flex-1 gap-2">
            {/* Верхняя строка */}
            <View className="flex-1 flex-row gap-2">
              {renderQuadrant(EisenhowerQuadrant.DO_FIRST)}
              {renderQuadrant(EisenhowerQuadrant.SCHEDULE)}
            </View>
            
            {/* Нижняя строка */}
            <View className="flex-1 flex-row gap-2">
              {renderQuadrant(EisenhowerQuadrant.DELEGATE)}
              {renderQuadrant(EisenhowerQuadrant.ELIMINATE)}
            </View>
          </View>

          {/* Главная кнопка добавления */}
          <TouchableOpacity
            className="absolute bottom-20 right-5 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: addButtonColor }}
            onPress={() => handleAddItem(EisenhowerQuadrant.DO_FIRST)}
          >
            <Feather name="plus" size={24} color={onPrimaryColor} />
          </TouchableOpacity>
        </View>

        {/* Модальное окно для создания/редактирования */}
        <MatrixItemModal
          isVisible={isModalVisible}
          item={selectedItem}
          onClose={handleModalClose}
          initialQuadrant={modalQuadrant}
        />
      </SafeAreaView>
    </ThemedView>
  )
}

