import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CommonInput } from '@/components';
import Colors from '@/constants/Colors';
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton';
import CalendarPickModal from '@/components/CalendarPickModal';
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { router } from 'expo-router';
import { useTaskStore } from '@/store/taskStore';

interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно';
  reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю';
}

const formatDate = (date: string): string => {
  const dayjsDate = dayjs(date);
  const day = dayjsDate.date();
  const monthName = dayjsDate.localeData().monthsShort(dayjsDate);
  const year = dayjsDate.year();
  return `${day} ${monthName} ${year}`;
};

export default function TaskScreen() {
  const { tasks, addTask } = useTaskStore();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedRepeat, setSelectedRepeat] = useState<Task['repeat']>('Никогда');
  const [selectedReminder, setSelectedReminder] = useState<Task['reminder']>('Нет');
  
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const taskModalRef = useRef<BottomSheetModal>(null);

  const repeatOptions: Task['repeat'][] = ['Никогда', 'Ежедневно', 'Еженедельно', 'Ежемесячно', 'Ежегодно'];
  const reminderOptions: Task['reminder'][] = ['Нет', 'За 1 час', 'За 1 день', 'За 1 неделю'];

  const handleDismiss = () => {
    bottomSheetRef.current?.dismiss();
  };

  const handlePresent = () => {
    bottomSheetRef.current?.present();
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleAddTask = () => {
    taskModalRef.current?.present();
  };

  const handleSaveTask = () => {
    if (!title.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      date: selectedDate,
      time: '12:00',
      repeat: selectedRepeat,
      reminder: selectedReminder
    };

    addTask(newTask);
    taskModalRef.current?.dismiss();
    setTitle('');
    setSelectedRepeat('Никогда');
    setSelectedReminder('Нет');
  };

  const handleTaskPress = (task: Task) => {
    router.push({
      pathname: "/task-details",
      params: task
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Задачи</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {tasks.map((task) => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskItem}
              onPress={() => handleTaskPress(task)}
            >
              <View style={styles.taskRow}>
                <View style={styles.checkbox} />
                <Text style={styles.taskTitle}>{task.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>Добавить задачу</Text>
        </TouchableOpacity>
      </View>

      <CalendarPickModal 
        handleDateChange={handleDateChange} 
        selectedDate={selectedDate} 
        handleDismiss={handleDismiss} 
        ref={bottomSheetRef}
      />

      <BottomSheetModal
        ref={taskModalRef}
        snapPoints={['90%']}
        index={0}
        enablePanDownToClose
      >
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Задача</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Название</Text>
            <CommonInput 
              placeholder="Введите название задачи" 
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Комментарий</Text>
            <CommonInput 
              placeholder="Введите комментарий" 
            />
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Дата</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <CommonInput placeholder={formatDate(selectedDate)} />
              </View>
              <CalendarPickButton handlePresent={handlePresent} />
            </View>
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
                <Text style={[
                  styles.optionText,
                  selectedRepeat === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
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
                <Text style={[
                  styles.optionText,
                  selectedReminder === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
            <Text style={styles.saveButtonText}>Сохранить</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8'
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 18
  },
  header: {
    marginBottom: 20
  },
  headerText: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.black
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.blue,
    marginRight: 12
  },
  taskTitle: {
    fontSize: 16,
    color: Colors.black
  },
  addButton: {
    backgroundColor: Colors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 100
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: Colors.black
  },
  inputContainer: {
    marginBottom: 24
  },
  dateContainer: {
    marginBottom: 24
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateInput: {
    flex: 1,
    marginRight: 16
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 8
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  selectedOption: {
    backgroundColor: Colors.blue
  },
  optionText: {
    fontSize: 16,
    color: Colors.black
  },
  selectedOptionText: {
    color: 'white'
  },
  saveButton: {
    backgroundColor: Colors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
