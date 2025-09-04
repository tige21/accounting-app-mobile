import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import Colors from '@/constants/Colors'
import ThemedText from '@/components/ThemedText'
import BackButton from '@/components/BackButton'
import { useTaskStore } from '@/store/taskStore'
import Feather from '@expo/vector-icons/Feather'
import { Task, TaskParams } from '@/types/task'

interface Task {
	id: string
	title: string
	date: string
	time: string
	repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
	reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
	comment?: string
	isCompleted?: boolean
	notificationTime?: string
}

const repeatOptions = [
	{ value: 'Никогда', label: 'Не повторять' },
	{ value: 'Ежедневно', label: 'Каждый день' },
	{ value: 'Еженедельно', label: 'Каждую неделю' },
	{ value: 'Ежемесячно', label: 'Каждый месяц' },
	{ value: 'Ежегодно', label: 'Каждый год' }
]

type RepeatType = Task['repeat']

interface TaskParams extends Record<string, string | undefined> {
	id: string
	title: string
	date: string
	time: string
	repeat: Task['repeat']
	reminder: string
	comment?: string
	isCompleted?: string
}

export default function TaskDetailsScreen() {
	const params = useLocalSearchParams<TaskParams>()
	const task = useTaskStore(state => state.tasks.find(t => t.id === params.id))

	const deleteTask = useTaskStore(state => state.deleteTask)
	const updateTask = useTaskStore(state => state.updateTask)

	const handleBack = () => {
		router.back()
	}

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
						deleteTask(params.id)
						router.back()
					}
				}
			]
		)
	}

	const handleComplete = () => {
		if (task) {
			const newIsCompleted = !task.isCompleted
			updateTask(task.id, { ...task, isCompleted: newIsCompleted })
		}
	}

	const handleEdit = () => {
		router.push({
			pathname: '/edit-task',
			params: {
				...params,
				repeat: task?.repeat || 'Никогда'
			}
		})
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

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
								<Feather name='check' size={16} color='white' />
							)}
						</TouchableOpacity>
						<ThemedText
							type="heading"
							style={[task?.isCompleted && styles.titleCompleted]}
						>
							{task?.title}
						</ThemedText>
					</View>
				</View>

				<View style={styles.section}>
					<ThemedText type="body" lightColor={Colors.grey_2}>Дата</ThemedText>
					<ThemedText type="subtitle">{formatDate(params.date)}</ThemedText>
				</View>

				{/* <View style={styles.section}>
					<Text style={styles.label}>Время</Text>
					<Text style={styles.value}>{params.time}</Text>
				</View> */}

				<View style={styles.section}>
					<ThemedText type="body" lightColor={Colors.grey_2}>Повтор</ThemedText>
					<ThemedText type="subtitle">
						{repeatOptions.find(option => option.value === task?.repeat)?.label || 'Не повторять'}
					</ThemedText>
				</View>

				<View style={styles.section}>
					<ThemedText type="body" lightColor={Colors.grey_2}>Комментарий</ThemedText>
					<View style={styles.commentContainer}>
						<ScrollView 
							style={styles.commentScroll}
						>
							<ThemedText type="default" style={styles.commentText}>
								{task?.comment || 'Нет комментария'}
							</ThemedText>
						</ScrollView>
					</View>
				</View>

				{task?.notificationTime && (
					<View style={styles.section}>
						<ThemedText type="body" lightColor={Colors.grey_2}>Уведомление</ThemedText>
						<ThemedText type="subtitle">{task.notificationTime}</ThemedText>
					</View>
				)}

				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.editButton} onPress={handleEdit}>
						<ThemedText type="defaultSemiBold" lightColor="white">Редактировать</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
						<ThemedText type="defaultSemiBold" lightColor="white">Удалить задачу</ThemedText>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F8F8'
	},
	content: {
		flex: 1,
		padding: 20
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
		marginBottom: 24,
		width: '100%'
	},
	label: {
		fontSize: 16,
		color: Colors.grey_2,
		marginBottom: 8
	},
	commentContainer: {
		borderRadius: 12,
		minHeight: 55,
		maxHeight: 200,
	},
	commentScroll: {
		padding: 12,
	},
	commentText: {
		fontSize: 16,
		color: Colors.black,
		flexWrap: 'wrap',
		lineHeight: 22,
	},
	value: {
		fontSize: 18,
		color: Colors.black,
		fontWeight: '500',
		flexWrap: 'wrap'
	},
	buttonContainer: {
		marginTop: 'auto',
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
})
