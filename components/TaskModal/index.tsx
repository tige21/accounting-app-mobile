import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CommonInput } from '@/components';
import Colors from '@/constants/Colors';

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isVisible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [selectedRepeat, setSelectedRepeat] = useState('Никогда');
  const [selectedReminder, setSelectedReminder] = useState('Нет');

  const repeatOptions = ['Никогда', 'Ежедневно', 'Еженедельно', 'Ежемесячно', 'Ежегодно'];
  const reminderOptions = ['Нет', 'За 1 час', 'За 1 день', 'За 1 неделю'];

  return (
    <BottomSheetModal
      snapPoints={['75%']}
      index={0}
      enablePanDownToClose
      onDismiss={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Задача</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Комментарий</Text>
          <CommonInput placeholder="Введите комментарий" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Повтор</Text>
          {repeatOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedRepeat === option && styles.selectedOption
              ]}
              onPress={() => setSelectedRepeat(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Напоминание</Text>
          {reminderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedReminder === option && styles.selectedOption
              ]}
              onPress={() => setSelectedReminder(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={() => onSave({
          title,
          repeat: selectedRepeat,
          reminder: selectedReminder
        })}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: Colors.black,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: Colors.blue,
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
  },
  saveButton: {
    backgroundColor: Colors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskModal; 