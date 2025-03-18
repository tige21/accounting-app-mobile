import React, { forwardRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Colors from '@/constants/Colors'
import Feather from '@expo/vector-icons/Feather'

interface RepeatPickModalProps {
  value?: string
  onChange: (repeat: string) => void
  onDismiss: () => void
}

const repeatOptions = [
  { value: 'Никогда', label: 'Не повторять' },
  { value: 'Ежедневно', label: 'Каждый день' },
  { value: 'Еженедельно', label: 'Каждую неделю' },
  { value: 'Ежемесячно', label: 'Каждый месяц' },
  { value: 'Ежегодно', label: 'Каждый год' }
]

const RepeatPickModal = forwardRef<BottomSheetModal, RepeatPickModalProps>(
  ({ value, onChange, onDismiss }, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['45%']}
        index={0}
        enablePanDownToClose
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onDismiss}>
              <Text style={styles.cancelButton}>Отмена</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Повтор</Text>
            <TouchableOpacity onPress={onDismiss}>
              <Text style={styles.doneButton}>Готово</Text>
            </TouchableOpacity>
          </View>

          {repeatOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                value === option.value && styles.optionSelected
              ]}
              onPress={() => {
                onChange(option.value)
                onDismiss()
              }}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>{option.label}</Text>
                {option.value !== 'Никогда' && (
                  <Text style={styles.optionDescription}>
                    {option.value === 'Ежедневно' && 'Каждый день в это же время'}
                    {option.value === 'Еженедельно' && 'В этот день каждую неделю'}
                    {option.value === 'Ежемесячно' && 'В это число каждый месяц'}
                    {option.value === 'Ежегодно' && 'В эту дату каждый год'}
                  </Text>
                )}
              </View>
              {value === option.value && (
                <View style={styles.checkmarkContainer}>
                  <Feather name="check" size={20} color={Colors.blue} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetModal>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.black,
  },
  cancelButton: {
    fontSize: 17,
    color: Colors.grey_2,
  },
  doneButton: {
    fontSize: 17,
    color: Colors.blue,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionSelected: {
    backgroundColor: Colors.blue + '10',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 17,
    color: Colors.black,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.grey_2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  }
})

export default RepeatPickModal 