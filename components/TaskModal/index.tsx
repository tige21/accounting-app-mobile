import React, { useState, forwardRef, useMemo, memo, useCallback, useRef, useEffect } from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Feather, Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ThemedView from '@/components/ThemedView'
import ThemedText from '@/components/ThemedText'
import CommonInput from '@/components/CommonInput'
import BackdropComponent from '@/components/BackdropComponent'
import CalendarPickModal from '@/components/CalendarPickModal'
import TimePickerModal from '@/components/TimePickerModal'
import RepeatPickModal from '@/components/RepeatPickModal'
import ReminderPickModal from '@/components/ReminderPickModal'
import { useDynamicStyles, useThemeColor } from '@/hooks'

export interface TaskData {
  title: string
  comment: string
  date: string
  time: string
  repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
  reminder: 'Нет' | 'За 5 минут' | 'За 15 минут' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
  notificationTime?: string
}

interface TaskModalProps {
  onSave: (task: TaskData) => void
  onDismiss: () => void
  initialData?: Partial<TaskData>
}

// Debounced input hook for performance optimization
const useDebounced = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Memoized input component for performance
const DebouncedInput = memo(({ value, onChangeText, placeholder, style, multiline, accessibilityLabel }: {
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  style?: any
  multiline?: boolean
  accessibilityLabel: string
}) => {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounced(localValue, 300)

  useEffect(() => {
    if (debouncedValue !== value) {
      onChangeText(debouncedValue)
    }
  }, [debouncedValue, onChangeText, value])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <CommonInput
      placeholder={placeholder}
      value={localValue}
      onChangeText={setLocalValue}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : undefined}
      style={style}
      isModal={Platform.OS === 'ios'}
      accessibilityLabel={accessibilityLabel}
    />
  )
})

DebouncedInput.displayName = 'DebouncedInput'

// Memoized selector button component
const SelectorButton = memo(({ 
  value, 
  onPress, 
  accessibilityLabel 
}: {
  value: string
  onPress: () => void
  accessibilityLabel: string
}) => {
  const styles = useDynamicStyles(createStyles)
  const iconColor = useThemeColor({}, 'textSecondary')

  return (
    <TouchableOpacity 
      style={styles.selectorButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <ThemedView colorName="surface" style={styles.selectorContent}>
        <ThemedText style={styles.selectorText}>{value}</ThemedText>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </ThemedView>
    </TouchableOpacity>
  )
})

SelectorButton.displayName = 'SelectorButton'

const TaskModal = memo(
  forwardRef<BottomSheetModal, TaskModalProps>(
    ({ onSave, onDismiss, initialData }, ref) => {
      // State management
      const [title, setTitle] = useState(initialData?.title || '')
      const [comment, setComment] = useState(initialData?.comment || '')
      const [selectedDate, setSelectedDate] = useState(
        initialData?.date || dayjs().format('YYYY-MM-DD')
      )
      const [selectedTime, setSelectedTime] = useState(
        initialData?.time || dayjs().format('HH:mm')
      )
      const [selectedRepeat, setSelectedRepeat] = useState(initialData?.repeat || 'Никогда')
      const [selectedReminder, setSelectedReminder] = useState(initialData?.reminder || 'Нет')

      // Modal refs
      const calendarModalRef = useRef<BottomSheetModal>(null)
      const timePickerModalRef = useRef<BottomSheetModal>(null)
      const repeatModalRef = useRef<BottomSheetModal>(null)
      const reminderModalRef = useRef<BottomSheetModal>(null)

      // Theme colors
      const primaryColor = useThemeColor({}, 'primary')

      // Dynamic styles
      const styles = useDynamicStyles(createStyles)

      // Snap points
      const snapPoints = useMemo(() => ['90%'], [])

      // Memoized formatted values
      const formattedDate = useMemo(() => {
        return dayjs(selectedDate).locale('ru').format('DD MMMM YYYY')
      }, [selectedDate])

      const formattedTime = useMemo(() => {
        return selectedTime
      }, [selectedTime])

      // Optimized callbacks
      const handleSave = useCallback(() => {
        if (!title.trim()) return
        
        onSave({
          title: title.trim(),
          comment: comment.trim(),
          date: selectedDate,
          time: selectedTime,
          repeat: selectedRepeat,
          reminder: selectedReminder
        })

        // Reset form
        setTitle('')
        setComment('')
        setSelectedDate(dayjs().format('YYYY-MM-DD'))
        setSelectedTime(dayjs().format('HH:mm'))
        setSelectedRepeat('Никогда')
        setSelectedReminder('Нет')
        onDismiss()
      }, [title, comment, selectedDate, selectedTime, selectedRepeat, selectedReminder, onSave, onDismiss])

      // Modal handlers
      const handleDatePress = useCallback(() => {
        calendarModalRef.current?.present()
      }, [])

      const handleTimePress = useCallback(() => {
        timePickerModalRef.current?.present()
      }, [])

      const handleRepeatPress = useCallback(() => {
        repeatModalRef.current?.present()
      }, [])

      const handleReminderPress = useCallback(() => {
        reminderModalRef.current?.present()
      }, [])

      // Modal change handlers
      const handleDateChange = useCallback((date: string) => {
        setSelectedDate(date)
        calendarModalRef.current?.dismiss()
      }, [])

      const handleTimeChange = useCallback((time: string) => {
        setSelectedTime(time)
        timePickerModalRef.current?.dismiss()
      }, [])

      const handleRepeatChange = useCallback((repeat: string) => {
        setSelectedRepeat(repeat as typeof selectedRepeat)
        repeatModalRef.current?.dismiss()
      }, [])

      const handleReminderChange = useCallback((reminder: string) => {
        setSelectedReminder(reminder as typeof selectedReminder)
        reminderModalRef.current?.dismiss()
      }, [])

      // Modal dismiss handlers
      const handleCalendarDismiss = useCallback(() => {
        calendarModalRef.current?.dismiss()
      }, [])

      const handleTimePickerDismiss = useCallback(() => {
        timePickerModalRef.current?.dismiss()
      }, [])

      const handleRepeatDismiss = useCallback(() => {
        repeatModalRef.current?.dismiss()
      }, [])

      const handleReminderDismiss = useCallback(() => {
        reminderModalRef.current?.dismiss()
      }, [])

      return (
        <>
          <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            backdropComponent={BackdropComponent}
            enablePanDownToClose
            onDismiss={onDismiss}
            accessibilityLabel="Task modal"
            backgroundStyle={[
              bottomSheetModalStyles.bottomSheetModal,
              { backgroundColor: styles.container.backgroundColor }
            ]}
          >
            <BottomSheetScrollView style={styles.container}>
              {/* Header */}
              <ThemedView colorName="surface" style={styles.header}>
                <ThemedView colorName="surface" style={styles.headerContent}>
                  <Feather 
                    name="plus-circle" 
                    size={24} 
                    color={primaryColor} 
                    style={styles.headerIcon}
                  />
                  <ThemedText type="heading" style={styles.title}>
                    {initialData ? 'Редактировать задачу' : 'Новая задача'}
                  </ThemedText>
                </ThemedView>
                <TouchableOpacity
                  onPress={handleSave}
                  accessibilityRole="button"
                  accessibilityLabel="Сохранить задачу"
                >
                  <ThemedText style={styles.doneButton}>Готово</ThemedText>
                </TouchableOpacity>
              </ThemedView>

              {/* Divider */}
              <ThemedView colorName="surface" style={styles.divider} />

              {/* Content */}
              <ThemedView colorName="surface" style={styles.content}>
                {/* Title Input */}
                <ThemedView colorName="surface" style={styles.inputContainer}>
                  <ThemedText type="secondary" style={styles.label}>
                    Название
                  </ThemedText>
                  <DebouncedInput
                    placeholder="Введите название задачи"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    accessibilityLabel="Название задачи"
                  />
                </ThemedView>

                {/* Date Selection */}
                <ThemedView colorName="surface" style={styles.inputContainer}>
                  <ThemedText type="secondary" style={styles.label}>
                    Дата
                  </ThemedText>
                  <SelectorButton
                    value={formattedDate}
                    onPress={handleDatePress}
                    accessibilityLabel="Выбрать дату задачи"
                  />
                </ThemedView>

                {/* Time Selection */}
                <ThemedView colorName="surface" style={styles.inputContainer}>
                  <ThemedText type="secondary" style={styles.label}>
                    Время
                  </ThemedText>
                  <SelectorButton
                    value={formattedTime}
                    onPress={handleTimePress}
                    accessibilityLabel="Выбрать время задачи"
                  />
                </ThemedView>

                {/* Comment Input */}
                <ThemedView colorName="surface" style={styles.inputContainer}>
                  <ThemedText type="secondary" style={styles.label}>
                    Комментарий
                  </ThemedText>
                  <DebouncedInput
                    placeholder="Введите комментарий"
                    value={comment}
                    onChangeText={setComment}
                    multiline={true}
                    style={[
                      styles.input,
                      {
                        minHeight: 80,
                        paddingTop: 12,
                        textAlignVertical: 'top',
                      }
                    ]}
                    accessibilityLabel="Комментарий к задаче"
                  />
                </ThemedView>

                {/* Repeat Section */}
                <ThemedView colorName="surface" style={styles.inputContainer}>
                  <ThemedText type="secondary" style={styles.label}>
                    Повтор
                  </ThemedText>
                  <SelectorButton
                    value={getRepeatLabel(selectedRepeat)}
                    onPress={handleRepeatPress}
                    accessibilityLabel="Выбрать повтор задачи"
                  />
                </ThemedView>

                {/* Reminder Section */}
                <ThemedView colorName="surface" style={styles.inputContainer}>
                  <ThemedText type="secondary" style={styles.label}>
                    Напоминание
                  </ThemedText>
                  <SelectorButton
                    value={getReminderLabel(selectedReminder)}
                    onPress={handleReminderPress}
                    accessibilityLabel="Выбрать напоминание для задачи"
                  />
                </ThemedView>
              </ThemedView>
            </BottomSheetScrollView>
          </BottomSheetModal>

          {/* Modal Components */}
          <CalendarPickModal
            ref={calendarModalRef}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            handleDismiss={handleCalendarDismiss}
          />

          <TimePickerModal
            ref={timePickerModalRef}
            value={selectedTime}
            onChange={handleTimeChange}
            onDismiss={handleTimePickerDismiss}
          />

          <RepeatPickModal
            ref={repeatModalRef}
            value={selectedRepeat}
            onChange={handleRepeatChange}
            onDismiss={handleRepeatDismiss}
          />

          <ReminderPickModal
            ref={reminderModalRef}
            value={selectedReminder}
            onChange={handleReminderChange}
            onDismiss={handleReminderDismiss}
          />
        </>
      )
    }
  )
)

// Helper functions
const getRepeatLabel = (repeat: string) => {
  const labels: { [key: string]: string } = {
    'Никогда': 'Не повторять',
    'Ежедневно': 'Каждый день',
    'Еженедельно': 'Каждую неделю',
    'Ежемесячно': 'Каждый месяц',
    'Ежегодно': 'Каждый год'
  }
  return labels[repeat] || repeat
}

const getReminderLabel = (reminder: string) => {
  const labels: { [key: string]: string } = {
    'Нет': 'Без напоминания',
    'За 5 минут': 'За 5 минут',
    'За 15 минут': 'За 15 минут',
    'За 1 час': 'За 1 час',
    'За 1 день': 'За 1 день', 
    'За 1 неделю': 'За 1 неделю'
  }
  return labels[reminder] || reminder
}

const createStyles = (colors: any) => ({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    paddingHorizontal: 4,
    backgroundColor: colors.surface,
  },
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    flex: 1,
  },
  doneButton: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '600' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    fontSize: 17,
    color: colors.textPrimary,
  },
  selectorButton: {
    borderRadius: 12,
    overflow: 'hidden' as const,
  },
  selectorContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
  },
  selectorText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
})

const bottomSheetModalStyles = {
  bottomSheetModal: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
}

TaskModal.displayName = 'TaskModal'

export default TaskModal