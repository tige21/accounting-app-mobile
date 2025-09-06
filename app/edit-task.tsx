import React, { useState, useRef, useEffect } from 'react'
import {
	View,
	TouchableOpacity,
	ScrollView,
	Platform,
	Switch
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import CommonInput from '@/components/CommonInput'
import BackButton from '@/components/BackButton'
import { useTaskStore } from '@/store/taskStore'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Feather from '@expo/vector-icons/Feather'
import dayjs from 'dayjs'
import { cancelTaskNotification, scheduleTaskNotification } from '@/utils/notifications/index'
import TimePickerModal from '@/components/TimePickerModal'
import RepeatPickModal from '@/components/RepeatPickModal'
import { ThemedText, ThemedView } from '@/components'
import { useDynamicStyles, useThemeColor } from '@/hooks'

interface TaskParams {
	id: string
	title: string
	date: string
	time: string
	repeat: string
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
	const params = useLocalSearchParams()
	const updateTask = useTaskStore(state => state.updateTask)
	const task = useTaskStore(state => state.tasks.find(t => t.id === params.id))
	const repeatPickModalRef = useRef<BottomSheetModal>(null)
	const timePickerRef = useRef<BottomSheetModal>(null)

	const onPrimaryColor = useThemeColor({}, 'onPrimary')
	const textSecondaryColor = useThemeColor({}, 'textSecondary')

	const [editedTask, setEditedTask] = useState({
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
				comment: task.comment || '',
				isCompleted: task.isCompleted || false,
				notificationTime: task.notificationTime,
				notificationId: task.notificationId
			})
		}
	}, [task])

	const handleRepeatPress = () => {
		repeatPickModalRef.current?.present()
	}

	const handleRepeatSelect = (value: string) => {
		setEditedTask(prev => ({
			...prev,
			repeat: value as 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
		}))
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

	const styles = useDynamicStyles(colors => ({
		container: {
			flex: 1
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
			fontWeight: '600' as const,
			color: colors.textPrimary,
			marginBottom: 24
		},
		inputContainer: {
			marginBottom: 24
		},
		label: {
			fontSize: 16,
			color: colors.textSecondary,
			marginBottom: 8
		},
		bottomContainer: {
			padding: 20,
			paddingBottom: Platform.OS === 'ios' ? 0 : 20
		},
		saveButton: {
			backgroundColor: colors.primary,
			padding: 16,
			borderRadius: 12,
			alignItems: 'center' as const
		},
		repeatButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
			backgroundColor: colors.surface,
			padding: 16,
			borderRadius: 12
		},
		notificationContainer: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			borderRadius: 8,
			paddingTop: 8
		},
		timeButton: {
			borderRadius: 8,
			marginLeft: 12
		}
	}))

	return (
		<ThemedView colorName='background' style={styles.container}>
			<SafeAreaView style={styles.container}>
				<BackButton handleBack={handleBack} />

				<View style={styles.wrapper}>
					<ScrollView style={styles.content}>
						<ThemedText style={styles.title}>Редактировать задачу</ThemedText>

						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Название</ThemedText>
							<CommonInput
								value={editedTask.title}
								onChangeText={text =>
									setEditedTask(prev => ({ ...prev, title: text }))
								}
								placeholder='Название задачи'
							/>
						</View>

						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Повтор</ThemedText>
							<TouchableOpacity
								style={styles.repeatButton}
								onPress={handleRepeatPress}
							>
								<ThemedText type="body">
									{repeatOptions.find(option => option.value === editedTask.repeat)?.label || 'Не повторять'}
								</ThemedText>
								<Feather name='chevron-right' size={20} color={textSecondaryColor} />
							</TouchableOpacity>
						</View>

						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Комментарий</ThemedText>
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
							<ThemedText style={styles.label}>Уведомление</ThemedText>
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
										<ThemedText type="body">
											{notificationTime || 'Выберите время'}
										</ThemedText>
									</TouchableOpacity>
								)}
							</View>
						</View>
					</ScrollView>

					<View style={styles.bottomContainer}>
						<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
							<ThemedText type="defaultSemiBold" style={{ color: onPrimaryColor }}>Сохранить</ThemedText>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>

			<RepeatPickModal
				ref={repeatPickModalRef}
				value={editedTask.repeat}
				onChange={handleRepeatSelect}
				onDismiss={() => repeatPickModalRef.current?.dismiss()}
			/>

			<TimePickerModal
				ref={timePickerRef}
				value={notificationTime}
				onChange={setNotificationTime}
				onDismiss={() => timePickerRef.current?.dismiss()}
			/>
		</ThemedView>
	)
}

