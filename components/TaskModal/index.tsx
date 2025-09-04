import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ThemedView from '@/components/ThemedView';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CommonInput from '@/components/CommonInput';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';

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
      <ThemedView style={styles.container}>
        <ThemedText type="heading">Задача</ThemedText>
        
        <ThemedView style={styles.inputContainer}>
          <ThemedText type="default">Комментарий</ThemedText>
          <CommonInput placeholder="Введите комментарий" />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText type="default">Повтор</ThemedText>
          {repeatOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedRepeat === option && styles.selectedOption
              ]}
              onPress={() => setSelectedRepeat(option)}
            >
              <ThemedText type="default">{option}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText type="default">Напоминание</ThemedText>
          {reminderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedReminder === option && styles.selectedOption
              ]}
              onPress={() => setSelectedReminder(option)}
            >
              <ThemedText type="default">{option}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <TouchableOpacity style={styles.saveButton} onPress={() => onSave({
          title,
          repeat: selectedRepeat,
          reminder: selectedReminder
        })}>
          <ThemedText type="defaultSemiBold" lightColor="white">Сохранить</ThemedText>
        </TouchableOpacity>
      </ThemedView>
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