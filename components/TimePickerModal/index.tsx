import React, { forwardRef, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import DateTimePicker from '@react-native-community/datetimepicker'
import Colors from '@/constants/Colors'
import dayjs from 'dayjs'

interface TimePickerModalProps {
  value?: string
  onChange: (time: string) => void
  onDismiss: () => void
}

const TimePickerModal = forwardRef<BottomSheetModal, TimePickerModalProps>(
  ({ value, onChange, onDismiss }, ref) => {
    const initialDate = value 
      ? dayjs(`2000-01-01 ${value}`).toDate()
      : new Date()

    const handleTimeChange = useCallback((_: any, date?: Date) => {
      if (date) {
        const timeString = dayjs(date).format('HH:mm')
        onChange(timeString)
      }
    }, [onChange])

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['25%']}
        enablePanDownToClose
        index={0}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Выберите время</Text>
            <TouchableOpacity onPress={onDismiss}>
              <Text style={styles.doneButton}>Готово</Text>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={initialDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
            style={styles.picker}
          />
        </View>
      </BottomSheetModal>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
  },
  doneButton: {
    fontSize: 17,
    color: Colors.blue,
    fontWeight: '600',
  },
  picker: {
    flex: 1,
  },
})

export default TimePickerModal 