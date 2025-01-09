import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import BackButton from '@/components/BackButton';
import { useTaskStore } from '@/store/taskStore';

interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно';
  reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю';
  comment?: string;
  isCompleted?: boolean;
}

export default function TaskDetailsScreen() {
  const params = useLocalSearchParams<Task>();
  const task = useTaskStore(state => 
    state.tasks.find(t => t.id === params.id)
  );
  
  const deleteTask = useTaskStore(state => state.deleteTask);
  const updateTask = useTaskStore(state => state.updateTask);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление задачи',
      'Вы уверены, что хотите удалить эту задачу?',
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteTask(params.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleComplete = () => {
    if (task) {
      const newIsCompleted = !task.isCompleted;
      updateTask(task.id, { ...task, isCompleted: newIsCompleted });
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/edit-task",
      params: params
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton handleBack={handleBack} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <TouchableOpacity 
              style={[
                styles.checkbox, 
                task?.isCompleted && styles.checkboxChecked
              ]} 
              onPress={handleComplete}
            >
              {task?.isCompleted && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
            <Text style={[
              styles.title, 
              task?.isCompleted && styles.titleCompleted
            ]}>
              {task?.title}
            </Text>
          </View>
         
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Дата</Text>
          <Text style={styles.value}>{formatDate(params.date)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Время</Text>
          <Text style={styles.value}>{params.time}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Повтор</Text>
          <Text style={styles.value}>{params.repeat}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Напоминание</Text>
          <Text style={styles.value}>{params.reminder}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Комментарий</Text>
          <Text style={styles.value}>{params.comment || 'Нет комментария'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Редактировать</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Удалить задачу</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 16
  },
  header: {
    marginBottom: 32
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    flex: 1
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.grey_2
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.blue,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxChecked: {
    backgroundColor: Colors.blue
  },
  section: {
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    color: Colors.grey_2,
    marginBottom: 8
  },
  value: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: '500'
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 24,
    gap: 12
  },
  editButton: {
    backgroundColor: Colors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 