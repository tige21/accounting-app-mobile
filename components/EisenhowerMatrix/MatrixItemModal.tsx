import React, { useState, useEffect } from 'react'
import { 
  View, 
  StyleSheet, 
  Alert,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { 
  ThemedText, 
  ThemedView, 
  CommonInput,
  BackdropComponent 
} from '@/components'
import { EisenhowerItem, EisenhowerQuadrant } from '@/types/eisenhower'
import { useEisenhowerStore } from '@/store/eisenhowerStore'
import { useThemeColor } from '@/hooks/useThemeColor'

interface MatrixItemModalProps {
  isVisible: boolean
  item?: EisenhowerItem | null
  onClose: () => void
  initialQuadrant?: EisenhowerQuadrant
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function MatrixItemModal({
  isVisible,
  item,
  onClose,
  initialQuadrant = EisenhowerQuadrant.DO_FIRST
}: MatrixItemModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [importance, setImportance] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [estimatedDuration, setEstimatedDuration] = useState('')
  const [tags, setTags] = useState('')

  const { addItem, updateItem } = useEisenhowerStore()
  const backgroundColor = useThemeColor({}, 'surface')
  const textColor = useThemeColor({}, 'textPrimary')
  const buttonColor = useThemeColor({}, 'primary')

  const snapPoints = ['60%', '80%']
  const bottomSheetRef = React.useRef<BottomSheetModal>(null)

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [isVisible])

  useEffect(() => {
    if (item) {
      // Режим редактирования
      setTitle(item.title)
      setDescription(item.description || '')
      setUrgency(item.urgency)
      setImportance(item.importance)
      setEstimatedDuration(item.estimatedDuration?.toString() || '')
      setTags(item.tags?.join(', ') || '')
    } else {
      // Режим создания
      resetForm()
    }
  }, [item])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setUrgency(3)
    setImportance(3)
    setEstimatedDuration('')
    setTags('')
  }

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название задачи')
      return
    }

    const itemData = {
      title: title.trim(),
      description: description.trim() || undefined,
      urgency,
      importance,
      quadrant: initialQuadrant,
      estimatedDuration: estimatedDuration ? parseInt(estimatedDuration, 10) : undefined,
      tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
    }

    if (item) {
      // Обновление существующего элемента
      updateItem(item.id, itemData)
    } else {
      // Создание нового элемента
      addItem(itemData)
    }

    onClose()
    resetForm()
  }

  const handleDelete = () => {
    if (!item) return

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
            onClose()
          }
        }
      ]
    )
  }

  const renderPriorityButton = (level: 1 | 2 | 3 | 4 | 5, type: 'urgency' | 'importance') => {
    const isSelected = type === 'urgency' ? urgency === level : importance === level
    
    return (
      <TouchableOpacity
        key={level}
        onPress={() => type === 'urgency' ? setUrgency(level) : setImportance(level)}
        style={[
          styles.priorityButton,
          {
            backgroundColor: isSelected ? buttonColor : backgroundColor,
            borderColor: buttonColor,
            borderWidth: 1,
          }
        ]}
      >
        <ThemedText style={{
          color: isSelected ? '#fff' : textColor,
          fontSize: 14,
          fontWeight: '600'
        }}>
          {level.toString()}
        </ThemedText>
      </TouchableOpacity>
    )
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={BackdropComponent}
      backgroundStyle={{ backgroundColor }}
    >
      <BottomSheetView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Заголовок */}
          <ThemedText type="heading" style={styles.modalTitle}>
            {item ? 'Редактировать' : 'Новая задача'}
          </ThemedText>

          {/* Название */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Название*
            </ThemedText>
            <CommonInput
              value={title}
              onChangeText={setTitle}
              placeholder="Введите название задачи"
              style={styles.input}
            />
          </View>

          {/* Описание */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Описание
            </ThemedText>
            <CommonInput
              value={description}
              onChangeText={setDescription}
              placeholder="Дополнительное описание (опционально)"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>

          {/* Срочность */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Срочность ({urgency}/5)
            </ThemedText>
            <View style={styles.priorityContainer}>
              {[1, 2, 3, 4, 5].map(level => 
                renderPriorityButton(level as 1 | 2 | 3 | 4 | 5, 'urgency')
              )}
            </View>
          </View>

          {/* Важность */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Важность ({importance}/5)
            </ThemedText>
            <View style={styles.priorityContainer}>
              {[1, 2, 3, 4, 5].map(level => 
                renderPriorityButton(level as 1 | 2 | 3 | 4 | 5, 'importance')
              )}
            </View>
          </View>

          {/* Длительность */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Примерная длительность (минут)
            </ThemedText>
            <CommonInput
              value={estimatedDuration}
              onChangeText={setEstimatedDuration}
              placeholder="30"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Теги */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Теги
            </ThemedText>
            <CommonInput
              value={tags}
              onChangeText={setTags}
              placeholder="работа, важно, срочно (через запятую)"
              style={styles.input}
            />
          </View>

          {/* Кнопки действий */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.actionButton, { backgroundColor: buttonColor }]}
            >
              <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                Сохранить
              </ThemedText>
            </TouchableOpacity>
            
            {item && (
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <ThemedText style={{ color: '#FF3B30', fontWeight: '600' }}>
                  Удалить
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 12,
    paddingTop: 20,
    paddingBottom: 40,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
})