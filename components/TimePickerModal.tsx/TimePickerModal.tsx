import React, { forwardRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import DateTimePicker from '@react-native-community/datetimepicker'
import Colors from '@/constants/Colors'

interface TimePickerModalProps {
  value?: string
  onChange: (time: string) => void
  onDismiss: () => void
}

const TimePickerModal = forwardRef<BottomSheetModal, TimePickerModalProps>(
  ({ value, onChange, onDismiss }, ref) => {
    const handleTimeChange = (_: any, date?: Date) => {
      if (date) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        onChange(`${hours}:${minutes}`)
      }
    }

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['40%']}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Выберите время</Text>
          <DateTimePicker
            value={value ? new Date(`2000-01-01T${value}`) : new Date()}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
          />
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Готово</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default TimePickerModal 