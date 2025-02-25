import React, { useState, useRef, useCallback, useEffect, memo } from 'react'
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	GestureResponderEvent,
	KeyboardAvoidingView,
	Platform,
	Switch
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetView
} from '@gorhom/bottom-sheet'
import CommonInput from '@/components/CommonInput'
import Colors from '@/constants/Colors'
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton'
import CalendarPickModal from '@/components/CalendarPickModal'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { router } from 'expo-router'
import { useTaskStore } from '@/store/taskStore'
import UserAvatar from '@/components/UserAvatar'
import BottomSheetInput from '@/components/BottomSheetInput'
import * as Haptics from 'expo-haptics'
import Feather from '@expo/vector-icons/Feather'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { bottomSheetModalStyles } from '@/components/CalendarPickModal/styles'
import { scheduleTaskNotification } from '@/utils/notifications'
import TimePickerModal from '@/components/TimePickerModal'
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
	notificationTime?: string // время уведомления в формате "HH:mm"
	notificationId?: string // ID запланированного уведомления
}

const renderBackdrop = () =>
	useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				{...props}
			/>
		),
		[]
	)

const formatDate = (date: string): string => {
	const dayjsDate = dayjs(date).locale('ru')
	const day = dayjsDate.date()
	const monthName = dayjsDate.format('MMM')
	const year = dayjsDate.year()
	return `${day} ${monthName} ${year}`
}

// Header компонент
const Header = memo(({ 
	selectedDate,
	onCalendarPress 
}: { 
	selectedDate: string
	onCalendarPress: () => void 
}) => {
	return (
		<View style={styles.header}>
			<View style={styles.headerRow}>
				<UserAvatar />
				<Text style={styles.headerText}>Задачи</Text>
			</View>

			<View style={styles.dateSelector}>
				<View style={styles.dateDisplay}>
					<Text style={styles.dateText}>
						{dayjs(selectedDate).locale('ru').format('D MMMM')}
					</Text>
				</View>
				<CalendarPickButton handlePresent={onCalendarPress} />
			</View>
		</View>
	)
})

// TaskItem компонент
const TaskItem = memo(({ 
	task, 
	onPress, 
	onComplete 
}: { 
	task: Task
	onPress: (task: Task) => void
	onComplete: (task: Task, e: GestureResponderEvent) => void
}) => {
	const handlePress = useCallback(() => {
		onPress(task)
	}, [task, onPress])

	const handleComplete = useCallback((e: GestureResponderEvent) => {
		onComplete(task, e)
	}, [task, onComplete])

	return (
		<TouchableOpacity
			style={styles.taskItem}
			onPress={handlePress}
		>
			<View style={styles.taskRow}>
				<TouchableOpacity
					style={[
						styles.checkbox,
						task.isCompleted && styles.checkboxChecked
					]}
					onPress={handleComplete}
				>
					{task.isCompleted && (
						<Feather name='check' size={16} color='white' />
					)}
				</TouchableOpacity>
				<Text
					style={[
						styles.taskTitle,
						task.isCompleted && styles.taskTitleCompleted
					]}
				>
					{task.title}
				</Text>
			</View>
		</TouchableOpacity>
	)
})

// TaskList компонент
const TaskList = memo(({ 
	tasks, 
	onTaskPress, 
	onTaskComplete 
}: { 
	tasks: Task[]
	onTaskPress: (task: Task) => void
	onTaskComplete: (task: Task, e: GestureResponderEvent) => void
}) => {
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			{tasks.map(task => (
				<TaskItem
					key={task.id}
					task={task}
					onPress={onTaskPress}
					onComplete={onTaskComplete}
				/>
			))}
		</ScrollView>
	)
})

// AddTaskModal компонент
const AddTaskModal = memo(({ 
	selectedDate,
	onSave,
	onCalendarPress,
	bottomSheetRef,
	repeatOptions,
}: {
	selectedDate: string
	onSave: (task: {
		title: string
		comment: string
		repeat: Task['repeat']
		notificationTime?: string
		notificationId?: string
	}) => void
	onCalendarPress: () => void
	bottomSheetRef: React.RefObject<BottomSheetModal>
	repeatOptions: Array<{ value: string; label: string }>
}) => {
	const [title, setTitle] = useState('')
	const [comment, setComment] = useState('')
	const [selectedRepeat, setSelectedRepeat] = useState<Task['repeat']>('Никогда')
	const [notificationTime, setNotificationTime] = useState<string | undefined>()
	const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)

	const timePickerRef = useRef<BottomSheetModal>(null)
	const repeatBottomSheetRef = useRef<BottomSheetModal>(null)

	const handleTimePress = () => {
		timePickerRef.current?.present()
	}

	const handleRepeatPress = () => {
		repeatBottomSheetRef.current?.present()
	}

	const handleRepeatSelect = (value: string) => {
		setSelectedRepeat(value as Task['repeat'])
		repeatBottomSheetRef.current?.dismiss()
	}

	const handleSave = () => {
		if (!title.trim()) return

		onSave({
			title: title.trim(),
			comment: comment.trim(),
			repeat: selectedRepeat,
			notificationTime: isNotificationEnabled ? notificationTime : undefined
		})

		// Очищаем форму
		setTitle('')
		setComment('')
		setSelectedRepeat('Никогда')
		setNotificationTime(undefined)
		setIsNotificationEnabled(false)
	}

	return (
		<BottomSheetScrollView style={styles.modalContainer}>
			<Text style={styles.modalTitle}>Задача</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Название</Text>
				<CommonInput
					isModal={Platform.OS === 'ios'}
					placeholder='Введите название задачи'
					value={title}
					onChangeText={setTitle}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Комментарий</Text>
				<CommonInput
					isModal={Platform.OS === 'ios'}
					placeholder='Введите комментарий'
					value={comment}
					onChangeText={setComment}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Повтор</Text>
				<TouchableOpacity 
					style={styles.repeatButton}
					onPress={handleRepeatPress}
				>
					<Text style={styles.repeatButtonText}>
						{repeatOptions.find(option => option.value === selectedRepeat)?.label || 'Не повторять'}
					</Text>
					<Feather name="chevron-down" size={20} color={Colors.grey_2} />
				</TouchableOpacity>
			</View>

			<View style={styles.dateContainer}>
				<Text style={styles.label}>Дата</Text>
				<View style={styles.dateRow}>
					<View style={styles.dateInput}>
						<CommonInput
							editable={false}
							placeholder={formatDate(selectedDate)}
						/>
					</View>
					<CalendarPickButton handlePresent={onCalendarPress} />
				</View>
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

			<TouchableOpacity
				style={styles.saveButton}
				onPress={handleSave}
			>
				<Text style={styles.saveButtonText}>Сохранить</Text>
			</TouchableOpacity>

			<TimePickerModal
				ref={timePickerRef}
				value={notificationTime}
				onChange={setNotificationTime}
				onDismiss={() => timePickerRef.current?.dismiss()}
			/>

			<BottomSheetModal
				ref={repeatBottomSheetRef}
				enableDynamicSizing
				index={0}
				enablePanDownToClose
				backgroundStyle={bottomSheetModalStyles.bottomSheetModal}
				backdropComponent={renderBackdrop()}
			>
				<RepeatModal
					selectedRepeat={selectedRepeat}
					repeatOptions={repeatOptions}
					onRepeatSelect={handleRepeatSelect}
					bottomSheetRef={repeatBottomSheetRef}
				/>
			</BottomSheetModal>
		</BottomSheetScrollView>
	)
})

// RepeatModal компонент
const RepeatModal = memo(({
	selectedRepeat,
	repeatOptions,
	onRepeatSelect,
	bottomSheetRef
}: {
	selectedRepeat: Task['repeat']
	repeatOptions: Array<{ value: string; label: string }>
	onRepeatSelect: (value: string) => void
	bottomSheetRef: React.RefObject<BottomSheetModal>
}) => {
	return (
		<BottomSheetView style={styles.repeatModalContainer}>
			<View style={styles.repeatModalHeader}>
				<Text style={styles.repeatModalTitle}>Повтор</Text>
				<TouchableOpacity 
					onPress={() => bottomSheetRef.current?.dismiss()}
					style={styles.closeButton}
				>
					<Feather name="x" size={24} color={Colors.grey_2} />
				</TouchableOpacity>
			</View>

			{repeatOptions.map((option) => (
				<TouchableOpacity
					key={option.value}
					style={styles.repeatOption}
					onPress={() => onRepeatSelect(option.value)}
				>
					<Text style={styles.repeatOptionText}>{option.label}</Text>
					{selectedRepeat === option.value && (
						<View style={styles.radioOuter}>
							<Feather name='check' size={16} color={Colors.blue} />
						</View>
					)}
				</TouchableOpacity>
			))}

			<TouchableOpacity 
				style={styles.saveButton}
				onPress={() => bottomSheetRef.current?.dismiss()}
			>
				<Text style={styles.saveButtonText}>Сохранить</Text>
			</TouchableOpacity>
		</BottomSheetView>
	)
})

export default function TaskScreen() {
	const { tasks, addTask, updateTask } = useTaskStore()
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString()
	)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [title, setTitle] = useState('')
	const [selectedRepeat, setSelectedRepeat] =
		useState<Task['repeat']>('Никогда')
	const [selectedReminder, setSelectedReminder] =
		useState<Task['reminder']>('Нет')
	const [comment, setComment] = useState('')
	const [notificationTime, setNotificationTime] = useState<string | undefined>()
	const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)

	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const taskModalRef = useRef<BottomSheetModal>(null)
	const calendarRef = useRef<BottomSheetModal>(null)
	const repeatBottomSheetRef = useRef<BottomSheetModal>(null)

	const opacity = useSharedValue(0)

	const repeatOptions = [
		{ value: 'Никогда', label: 'Не повторять' },
		{ value: 'Ежедневно', label: 'Каждый день' },
		{ value: 'Еженедельно', label: 'Каждую неделю' },
		{ value: 'Ежемесячно', label: 'Каждый месяц' },
		{ value: 'Ежегодно', label: 'Каждый год' }
	]

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 500 })
	}, [])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value
		}
	})

	const handleDismiss = () => {
		bottomSheetRef.current?.dismiss()
	}

	const handlePresent = () => {
		bottomSheetRef.current?.present()
	}

	const handleDateChange = (date: string) => {
		setSelectedDate(date)
	}

	const handleAddTask = () => {
		taskModalRef.current?.present()
	}

	const handleRepeatPress = () => {
		repeatBottomSheetRef.current?.present()
	}

	const handleRepeatSelect = (value: string) => {
		setSelectedRepeat(value as Task['repeat'])
		repeatBottomSheetRef.current?.dismiss()
	}

	const handleSaveTask = async (taskData: {
		title: string
		comment: string
		repeat: Task['repeat']
		notificationTime?: string
	}) => {
		const newTask: Task = {
			id: Date.now().toString(),
			title: taskData.title,
			date: dayjs(selectedDate).toISOString(),
			time: '12:00',
			repeat: taskData.repeat,
			reminder: 'Нет',
			comment: taskData.comment,
			isCompleted: false,
			notificationTime: taskData.notificationTime
		}

		// Если включено уведомление, планируем его
		if (taskData.notificationTime) {
			const notificationId = await scheduleTaskNotification({
				id: newTask.id,
				title: newTask.title,
				date: newTask.date,
				notificationTime: taskData.notificationTime
			})
			if (notificationId) {
				newTask.notificationId = notificationId
			}
		}

		addTask(newTask)
		taskModalRef.current?.dismiss()
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
	}

	const handleTaskPress = useCallback((task: Task) => {
		router.push({
			pathname: '/task-details',
			params: {
				id: task.id,
				title: task.title,
				date: task.date,
				time: task.time,
				repeat: task.repeat,
				reminder: task.reminder,
				comment: task.comment,
				isCompleted: task.isCompleted ? 'true' : 'false'
			}
		})
	}, [])

	const handleTaskComplete = useCallback((task: Task, e: GestureResponderEvent) => {
		e.stopPropagation()
		updateTask(task.id, { ...task, isCompleted: !task.isCompleted })
	}, [updateTask])

	const handleCalendarPresent = () => {
		calendarRef.current?.present()
	}

	const handleCalendarDismiss = () => {
		calendarRef.current?.dismiss()
	}

	const handleDateSelect = (date: string) => {
		setSelectedDate(date)
		handleCalendarDismiss()
	}

	const filteredTasks = tasks.filter(task => {
		const taskDate = dayjs(task.date).startOf('day')
		const selectedDay = dayjs(selectedDate).startOf('day')
		const today = dayjs().startOf('day')
		
		// Проверяем базовое совпадение дат
		if (taskDate.isSame(selectedDay)) {
			return true
		}

		// Если выбранная дата меньше даты создания задачи, не показываем
		if (selectedDay.isBefore(taskDate)) {
			return false
		}

		// Проверяем повторяющиеся задачи
		switch (task.repeat) {
			case 'Ежедневно':
				// Показываем только если выбранная дата не раньше даты создания
				return !selectedDay.isBefore(taskDate)
			case 'Еженедельно':
				return taskDate.day() === selectedDay.day() && !selectedDay.isBefore(taskDate)
			case 'Ежемесячно':
				return taskDate.date() === selectedDay.date() && !selectedDay.isBefore(taskDate)
			case 'Ежегодно':
				return taskDate.month() === selectedDay.month() && 
					   taskDate.date() === selectedDay.date() && 
					   !selectedDay.isBefore(taskDate)
			default:
				return false
		}
	})

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}
			>
				<Animated.View style={[styles.content, animatedStyle]}>
					<Header 
						selectedDate={selectedDate} 
						onCalendarPress={handleCalendarPresent}
					/>
					
					<TaskList
						tasks={filteredTasks}
						onTaskPress={handleTaskPress}
						onTaskComplete={handleTaskComplete}
					/>

					<TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
						<Text style={styles.addButtonText}>Добавить задачу</Text>
					</TouchableOpacity>
				</Animated.View>

				<BottomSheetModal
					ref={taskModalRef}
					enableDynamicSizing
					index={0}
					enablePanDownToClose
					backgroundStyle={bottomSheetModalStyles.bottomSheetModal}
					backdropComponent={renderBackdrop()}
				>
					<AddTaskModal
						selectedDate={selectedDate}
						onSave={handleSaveTask}
						onCalendarPress={handleCalendarPresent}
						bottomSheetRef={taskModalRef}
						repeatOptions={repeatOptions}
					/>
				</BottomSheetModal>

				<BottomSheetModal
					ref={repeatBottomSheetRef}
					enableDynamicSizing
					index={0}
					enablePanDownToClose
					backgroundStyle={bottomSheetModalStyles.bottomSheetModal}
					backdropComponent={renderBackdrop()}
				>
					<RepeatModal
						selectedRepeat={selectedRepeat}
						repeatOptions={repeatOptions}
						onRepeatSelect={handleRepeatSelect}
						bottomSheetRef={repeatBottomSheetRef}
					/>
				</BottomSheetModal>

				<CalendarPickModal
					ref={calendarRef}
					handleDateChange={handleDateSelect}
					selectedDate={selectedDate}
					handleDismiss={handleCalendarDismiss}
				/>
			</KeyboardAvoidingView>
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
		margin: 20
	},
	header: {
		marginBottom: 10,
		gap: 20
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
		marginRight: 12,
		alignItems: 'center',
		justifyContent: 'center'
	},
	checkboxChecked: {
		backgroundColor: Colors.blue
	},
	checkmark: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold'
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
		marginBottom: Platform.OS === 'ios' ? 0 : 24
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
	repeatButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		borderRadius: 8
	  },
	  repeatButtonText: {
		fontSize: 16,
		color: Colors.black
	  },
	  repeatModalContainer: {
		padding: 16,
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
		
		alignItems: 'center',
		justifyContent: 'center'
	  },
	  radioInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: Colors.blue
	  },
	saveButton: {
		backgroundColor: Colors.blue,
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 24,
		marginBottom: 50
	},
	saveButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	taskTitleCompleted: {
		textDecorationLine: 'line-through',
		color: Colors.grey_2
	},
	dateSelector: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 12,
		marginBottom: 16
	},
	dateDisplay: {
		flex: 1,
		marginRight: 12
	},
	dateText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.black
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	notificationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		paddingTop: 12,
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
