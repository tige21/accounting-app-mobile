import React, { useState, useRef, useEffect } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Platform,
	Switch
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import Colors from '@/constants/Colors'
import CommonInput from '@/components/CommonInput'
import BackButton from '@/components/BackButton'
import { useTaskStore } from '@/store/taskStore'
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetView
} from '@gorhom/bottom-sheet'
import Feather from '@expo/vector-icons/Feather'
import dayjs from 'dayjs'
import { cancelTaskNotification, scheduleTaskNotification } from '@/utils/notifications'
import { Task, TaskParams } from '@/types/task'
import TimePickerModal from '@/components/TimePickerModal'

interface Task {
	id: string
	title: string
	date: string
	time: string
	repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
	reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
	comment: string
	isCompleted: boolean
	notificationTime?: string
	notificationId?: string
}

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

const repeatOptions = [
	{ value: 'Никогда', label: 'Не повторять' },
	{ value: 'Ежедневно', label: 'Каждый день' },
	{ value: 'Еженедельно', label: 'Каждую неделю' },
	{ value: 'Ежемесячно', label: 'Каждый месяц' },
	{ value: 'Ежегодно', label: 'Каждый год' }
]

export default function EditTaskScreen() {
	const params = useLocalSearchParams<TaskParams>()
	const updateTask = useTaskStore(state => state.updateTask)
	const task = useTaskStore(state => state.tasks.find(t => t.id === params.id))
	const repeatBottomSheetRef = useRef<BottomSheetModal>(null)
	const timePickerRef = useRef<BottomSheetModal>(null)

	const [editedTask, setEditedTask] = useState<Task>({
		id: task?.id || '',
		title: task?.title || '',
		date: task?.date || new Date().toISOString(),
		time: task?.time || '12:00',
		repeat: task?.repeat || 'Никогда',
		reminder: task?.reminder || 'Нет',
		comment: task?.comment || '',
		isCompleted: task?.isCompleted || false,
		notificationTime: task?.notificationTime,
		notificationId: task?.notificationId
	})

	const [isNotificationEnabled, setIsNotificationEnabled] = useState(!!task?.notificationTime)
	const [notificationTime, setNotificationTime] = useState(task?.notificationTime)

	useEffect(() => {
		if (task) {
			setEditedTask({
				id: task.id,
				title: task.title,
				date: task.date,
				time: task.time,
				repeat: task.repeat,
				reminder: task.reminder,
				comment: task.comment,
				isCompleted: task.isCompleted,
				notificationTime: task.notificationTime,
				notificationId: task.notificationId
			})
		}
	}, [task])

	const handleRepeatPress = () => {
		repeatBottomSheetRef.current?.present()
	}

	const handleRepeatSelect = (value: string) => {
		setEditedTask(prev => ({
			...prev,
			repeat: value as Task['repeat']
		}))
		repeatBottomSheetRef.current?.dismiss()
	}

	const handleTimePress = () => {
		timePickerRef.current?.present()
	}

	const handleSave = async () => {
		if (editedTask.title.trim()) {
			const updatedTask = {
				...editedTask,
				title: editedTask.title.trim(),
				date: dayjs(editedTask.date).toISOString(),
				repeat: editedTask.repeat,
				comment: editedTask.comment.trim(),
				notificationTime: isNotificationEnabled ? notificationTime : undefined
			}

			// Отменяем старое уведомление
			if (task?.notificationId) {
				await cancelTaskNotification(task.notificationId)
			}

			// Создаем новое уведомление
			if (isNotificationEnabled && notificationTime) {
				const notificationId = await scheduleTaskNotification({
					id: updatedTask.id,
					title: updatedTask.title,
					date: updatedTask.date,
					notificationTime: notificationTime
				})
				if (notificationId) {
					updatedTask.notificationId = notificationId
				}
			}

			updateTask(editedTask.id, updatedTask)
			router.back()
		}
	}

	const handleBack = () => {
		router.back()
	}

	return (
		<SafeAreaView style={styles.container}>
			<BackButton handleBack={handleBack} />

			<View style={styles.wrapper}>
				<ScrollView style={styles.content}>
					<Text style={styles.title}>Редактировать задачу</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Название</Text>
						<CommonInput
							value={editedTask.title}
							onChangeText={text =>
								setEditedTask(prev => ({ ...prev, title: text }))
							}
							placeholder='Название задачи'
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Повтор</Text>
						<TouchableOpacity
							style={styles.repeatButton}
							onPress={handleRepeatPress}
						>
							<Text style={styles.repeatButtonText}>
								{repeatOptions.find(option => option.value === editedTask.repeat)?.label || 'Не повторять'}
							</Text>
							<Feather name='chevron-right' size={20} color={Colors.grey_2} />
						</TouchableOpacity>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Комментарий</Text>
						<CommonInput
							value={editedTask.comment || ''}
							onChangeText={text =>
								setEditedTask(prev => ({ ...prev, comment: text }))
							}
							placeholder='Добавить комментарий'
							multiline
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Уведомление</Text>
						<View style={styles.notificationContainer}>
							<Switch
								value={isNotificationEnabled}
								onValueChange={setIsNotificationEnabled}
							/>
							{isNotificationEnabled && (
								<TouchableOpacity 
									style={styles.timeButton}
									onPress={handleTimePress}
								>
									<Text style={styles.timeText}>
										{notificationTime || 'Выберите время'}
									</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</ScrollView>

				<View style={styles.bottomContainer}>
					<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
						<Text style={styles.saveButtonText}>Сохранить</Text>
					</TouchableOpacity>
				</View>
			</View>

			<BottomSheetModal
				ref={repeatBottomSheetRef}
				enableDynamicSizing
				backdropComponent={props => (
					<BottomSheetBackdrop
						{...props}
						appearsOnIndex={0}
						disappearsOnIndex={-1}
					/>
				)}
			>
				<BottomSheetView style={styles.repeatModalContainer}>
					<View style={styles.repeatModalHeader}>
						<Text style={styles.repeatModalTitle}>Повтор</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => repeatBottomSheetRef.current?.dismiss()}
						>
							<Feather name='x' size={24} color={Colors.black} />
						</TouchableOpacity>
					</View>

					{repeatOptions.map(option => (
						<TouchableOpacity
							key={option.value}
							style={styles.repeatOption}
							onPress={() => handleRepeatSelect(option.value)}
						>
							<Text style={styles.repeatOptionText}>{option.label}</Text>
							<View>
								{editedTask.repeat === option.value && (
									<Feather name='check' size={16} color={Colors.blue} />
								)}
							</View>
						</TouchableOpacity>
					))}
				</BottomSheetView>
			</BottomSheetModal>

			<TimePickerModal
				ref={timePickerRef}
				value={notificationTime}
				onChange={setNotificationTime}
				onDismiss={() => timePickerRef.current?.dismiss()}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F8F8'
	},
	wrapper: {
		flex: 1
	},
	content: {
		flex: 1,
		padding: 20
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: Colors.black,
		marginBottom: 24
	},
	inputContainer: {
		marginBottom: 24
	},
	label: {
		fontSize: 16,
		color: Colors.grey_2,
		marginBottom: 8
	},
	bottomContainer: {
		padding: 20,
		paddingBottom: Platform.OS === 'ios' ? 0 : 20,
		backgroundColor: '#F8F8F8'
	},
	saveButton: {
		backgroundColor: Colors.blue,
		padding: 16,
		borderRadius: 12,
		alignItems: 'center'
	},
	saveButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	repeatButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 12
	},
	repeatButtonText: {
		fontSize: 16,
		color: Colors.black
	},
	repeatModalContainer: {
		padding: 16,
		paddingBottom: Platform.OS === 'ios' ? 0 : 16
	},
	repeatModalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24
	},
	repeatModalTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.black
	},
	closeButton: {
		padding: 4
	},
	repeatOption: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 4
	},
	repeatOptionText: {
		fontSize: 16,
		color: Colors.black
	},
	radioOuter: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderColor: Colors.blue,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	radioInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: Colors.blue
	},
	notificationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
		paddingTop: 8
	},
	timeButton: {
		borderRadius: 8,
		marginLeft: 12
	},
	timeText: {
		fontSize: 16,
		color: Colors.black
	}
})
