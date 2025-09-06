import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	memo,
	useMemo
} from 'react'
import {
	View,
	FlatList,
	TouchableOpacity,
	GestureResponderEvent,
	KeyboardAvoidingView,
	Platform,
	ListRenderItemInfo
} from 'react-native'
import ThemedView from '@/components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
	BottomSheetModal
} from '@gorhom/bottom-sheet'
import ThemedText from '@/components/ThemedText'
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton'
import CalendarPickModal from '@/components/CalendarPickModal'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { router } from 'expo-router'
import { useTaskStore } from '@/store/taskStore'
import UserAvatar from '@/components/UserAvatar'
import * as Haptics from 'expo-haptics'
import Feather from '@expo/vector-icons/Feather'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated'
import { scheduleTaskNotification } from '@/utils/notifications/index'
import { Note } from '@/types/note'
import NotebookModal from '@/components/NotebookModal'
import TaskModal, { TaskData } from '@/components/TaskModal'
import RepeatPickModal from '@/components/RepeatPickModal'
import { useNoteStore } from '@/store/noteStore'
import { useDynamicStyles, useThemeColor } from '@/hooks'

interface Task {
	id: string
	title: string
	date: string
	time: string
	repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
	reminder: 'Нет' | 'За 5 минут' | 'За 15 минут' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
	comment?: string
	isCompleted?: boolean
	notificationTime?: string // время уведомления в формате "HH:mm"
	notificationId?: string // ID запланированного уведомления
}


// Header компонент
const Header = memo(
	({
		selectedDate,
		onCalendarPress
	}: {
		selectedDate: string
		onCalendarPress: () => void
	}) => {
		return (
			<ThemedView style={{ marginBottom: 10, gap: 20 }}>
				<ThemedView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
					<ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
						<UserAvatar />
						<ThemedText type='heading'>Задачи</ThemedText>
					</ThemedView>
					
					<TouchableOpacity
						onPress={() => router.push('/eisenhower-matrix')}
						style={{
							padding: 8,
							borderRadius: 8,
							backgroundColor: 'rgba(0, 122, 255, 0.1)',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Feather name="grid" size={20} color="#007AFF" />
					</TouchableOpacity>
				</ThemedView>

				<ThemedView
					colorName='surface'
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						padding: 12,
						borderRadius: 12,
						marginBottom: 16
					}}
				>
					<ThemedView
						colorName='transparent'
						style={{ flex: 1, marginRight: 12 }}
					>
						<ThemedText>
							{dayjs(selectedDate).locale('ru').format('D MMMM')}
						</ThemedText>
					</ThemedView>
					<CalendarPickButton handlePresent={onCalendarPress} />
				</ThemedView>
			</ThemedView>
		)
	}
)

// TaskItem компонент - оптимизированный с React.memo и правильными зависимостями
const TaskItem = memo(
	({
		task,
		onPress,
		onComplete
	}: {
		task: Task
		onPress: (task: Task) => void
		onComplete: (task: Task, e: GestureResponderEvent) => void
	}) => {
		const primaryColor = useThemeColor({}, 'primary')
		const onPrimaryColor = useThemeColor({}, 'onPrimary')
		const textSecondaryColor = useThemeColor({}, 'textSecondary')

		const handlePress = useCallback(() => {
			onPress(task)
		}, [task.id, onPress]) // Используем task.id вместо всего объекта

		const handleComplete = useCallback(
			(e: GestureResponderEvent) => {
				onComplete(task, e)
			},
			[task.id, task.isCompleted, onComplete] // Оптимизированные зависимости
		)

		return (
			<TouchableOpacity onPress={handlePress}>
				<ThemedView
					colorName='surface'
					style={{ padding: 16, borderRadius: 12, marginBottom: 12 }}
				>
					<ThemedView
						colorName='transparent'
						style={{ flexDirection: 'row', alignItems: 'center' }}
					>
						<TouchableOpacity
							style={[
								{
									width: 24,
									height: 24,
									borderRadius: 12,
									borderWidth: 2,
									borderColor: primaryColor,
									marginRight: 12,
									alignItems: 'center',
									justifyContent: 'center'
								},
								task.isCompleted && { backgroundColor: primaryColor }
							]}
							onPress={handleComplete}
						>
							{task.isCompleted && (
								<Feather name='check' size={16} color={onPrimaryColor} />
							)}
						</TouchableOpacity>
						<ThemedText
							type='defaultSemiBold'
							style={[
								task.isCompleted && {
									textDecorationLine: 'line-through',
									color: textSecondaryColor
								}
							]}
						>
							{task.title}
						</ThemedText>
					</ThemedView>
				</ThemedView>
			</TouchableOpacity>
		)
	},
	// Кастомная функция сравнения для оптимизации перерендеров
	(prevProps, nextProps) => {
		return (
			prevProps.task.id === nextProps.task.id &&
			prevProps.task.title === nextProps.task.title &&
			prevProps.task.isCompleted === nextProps.task.isCompleted
		)
	}
)

// TaskList компонент - оптимизированный с FlatList
const TaskList = memo(
	({
		tasks,
		onTaskPress,
		onTaskComplete
	}: {
		tasks: Task[]
		onTaskPress: (task: Task) => void
		onTaskComplete: (task: Task, e: GestureResponderEvent) => void
	}) => {
		// Функция рендеринга элемента для FlatList
		const renderTask = useCallback(
			({ item }: ListRenderItemInfo<Task>) => (
				<TaskItem
					task={item}
					onPress={onTaskPress}
					onComplete={onTaskComplete}
				/>
			),
			[onTaskPress, onTaskComplete]
		)

		// Функция получения ключа для элемента
		const keyExtractor = useCallback((item: Task) => item.id, [])

		// Оптимизация для больших списков - можно раскомментировать при необходимости
		// const getItemLayout = useCallback(
		// 	(data: Task[] | null | undefined, index: number) => {
		// 		const ITEM_HEIGHT = 76 // высота элемента + margin
		// 		return {
		// 			length: ITEM_HEIGHT,
		// 			offset: ITEM_HEIGHT * index,
		// 			index
		// 		}
		// 	},
		// 	[]
		// )

		return (
			<FlatList
				data={tasks}
				renderItem={renderTask}
				keyExtractor={keyExtractor}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
				// getItemLayout={getItemLayout} // Раскомментировать для фиксированной высоты элементов
				maxToRenderPerBatch={10} // Рендерим по 10 элементов за раз
				windowSize={10} // Количество экранов для предзагрузки
				initialNumToRender={15} // Начальное количество элементов
				updateCellsBatchingPeriod={50} // Батчинг обновлений
				removeClippedSubviews={true} // Удаляем элементы вне области видимости
				ListEmptyComponent={
					<ThemedView
						colorName='background'
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 40
						}}
					>
						<ThemedText
							type='secondary'
							style={{ fontSize: 16, fontWeight: '500' }}
						>
							На сегодня задач нет
						</ThemedText>
					</ThemedView>
				}
			/>
		)
	}
)


// ModeSwitcher компонент
const ModeSwitcher = memo(
	({
		currentMode,
		onModeChange
	}: {
		currentMode: 'tasks' | 'notes'
		onModeChange: (mode: 'tasks' | 'notes') => void
	}) => {
		const primaryColor = useThemeColor({}, 'primary')
		const onPrimaryColor = useThemeColor({}, 'onPrimary')
		const textSecondaryColor = useThemeColor({}, 'textSecondary')

		return (
			<ThemedView
				colorName='surfaceSecondary'
				style={{
					flexDirection: 'row',
					padding: 4,
					borderRadius: 12,
					marginBottom: 16
				}}
			>
				<TouchableOpacity
					style={[
						{
							flex: 1,
							paddingVertical: 8,
							paddingHorizontal: 16,
							borderRadius: 8,
							alignItems: 'center'
						},
						currentMode === 'tasks' && { backgroundColor: primaryColor }
					]}
					onPress={() => onModeChange('tasks')}
				>
					<ThemedText
						style={{
							fontSize: 16,
							fontWeight: '500',
							color:
								currentMode === 'tasks' ? onPrimaryColor : textSecondaryColor
						}}
					>
						Задачи
					</ThemedText>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						{
							flex: 1,
							paddingVertical: 8,
							paddingHorizontal: 16,
							borderRadius: 8,
							alignItems: 'center'
						},
						currentMode === 'notes' && { backgroundColor: primaryColor }
					]}
					onPress={() => onModeChange('notes')}
				>
					<ThemedText
						style={{
							fontSize: 16,
							fontWeight: '500',
							color:
								currentMode === 'notes' ? onPrimaryColor : textSecondaryColor
						}}
					>
						Заметки
					</ThemedText>
				</TouchableOpacity>
			</ThemedView>
		)
	}
)

export default function TaskScreen() {
	const { tasks, addTask, updateTask } = useTaskStore()
	const { notes, addNote } = useNoteStore()
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString()
	)
	const [selectedRepeat, setSelectedRepeat] =
		useState<Task['repeat']>('Никогда')
	const [mode, setMode] = useState<'tasks' | 'notes'>('tasks')

	// Theme colors for the main screen
	const addButtonIconColor = useThemeColor({}, 'onPrimary')

	const taskModalRef = useRef<BottomSheetModal>(null)
	const calendarRef = useRef<BottomSheetModal>(null)
	const repeatBottomSheetRef = useRef<BottomSheetModal>(null)
	const notebookModalRef = useRef<BottomSheetModal>(null)

	const opacity = useSharedValue(0)

	const styles = useDynamicStyles(colors => ({
		container: {
			flex: 1,
			marginBottom: Platform.OS === 'ios' ? -55 : -20
		},
		safeArea: {
			flex: 1
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
			color: colors.textPrimary
		},
		taskItem: {
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
			borderColor: colors.primary,
			marginRight: 12,
			alignItems: 'center',
			justifyContent: 'center'
		},
		checkboxChecked: {
			backgroundColor: colors.primary
		},
		checkmark: {
			color: colors.onPrimary,
			fontSize: 16,
			fontWeight: 'bold'
		},
		taskTitle: {
			fontSize: 16,
			color: colors.textPrimary
		},
		addButton: {
			position: 'absolute' as const,
			bottom: 60,
			right: 20,
			width: 56,
			height: 56,
			borderRadius: 28,
			backgroundColor: colors.primary,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			shadowColor: colors.shadow,
			shadowOffset: {
				width: 0,
				height: 2
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
			zIndex: 1
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
			color: colors.textPrimary
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
			color: colors.textPrimary,
			marginBottom: 8
		},
		optionButton: {
			padding: 12,
			borderRadius: 8,
			marginBottom: 8
		},
		selectedOption: {
			backgroundColor: colors.primary
		},
		optionText: {
			fontSize: 16,
			color: colors.textPrimary
		},
		selectedOptionText: {
			color: colors.onPrimary
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
			color: colors.textPrimary
		},
		repeatModalContainer: {
			padding: 16
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
			color: colors.textPrimary
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
			color: colors.textPrimary
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
			backgroundColor: colors.primary
		},
		saveButton: {
			backgroundColor: colors.primary,
			padding: 16,
			borderRadius: 12,
			alignItems: 'center',
			marginTop: 24,
			marginBottom: 50
		},
		saveButtonText: {
			color: colors.onPrimary,
			fontSize: 16,
			fontWeight: '600'
		},
		taskTitleCompleted: {
			textDecorationLine: 'line-through',
			color: colors.textSecondary
		},
		dateSelector: {
			flexDirection: 'row',
			alignItems: 'center',
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
			color: colors.textPrimary
		},
		headerRow: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		notificationContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingTop: 12
		},
		timeButton: {
			borderRadius: 8,
			marginLeft: 12
		},
		timeText: {
			fontSize: 16,
			color: colors.textPrimary
		},
		commentInput: {
			minHeight: 55,
			paddingTop: 12,
			textAlignVertical: 'top',
			paddingHorizontal: 12,
			borderRadius: 12,
			fontSize: 16
		},
		flexibleInput: {
			flex: 1,
			flexWrap: 'wrap'
		},
		switcherContainer: {
			flexDirection: 'row',
			backgroundColor: colors.surfaceSecondary,
			padding: 4,
			borderRadius: 12,
			marginBottom: 16
		},
		switcherButton: {
			flex: 1,
			paddingVertical: 8,
			paddingHorizontal: 16,
			borderRadius: 8,
			alignItems: 'center'
		},
		switcherButtonActive: {
			backgroundColor: colors.primary
		},
		switcherText: {
			fontSize: 16,
			color: colors.textSecondary,
			fontWeight: '500'
		},
		switcherTextActive: {
			color: colors.onPrimary
		},
		notesList: {
			flex: 1
		},
		noteItem: {
			padding: 16,
			borderRadius: 12,
			marginBottom: 12,
			flexDirection: 'row',
			alignItems: 'center'
		},
		noteContent: {
			flex: 1,
			marginRight: 12
		},
		noteTitle: {
			fontSize: 17,
			fontWeight: '600',
			color: colors.textPrimary,
			marginBottom: 4
		},
		notePreview: {
			fontSize: 15,
			color: colors.textSecondary
		},
		completedText: {
			textDecorationLine: 'line-through',
			color: colors.textSecondary
		},
		emptyState: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: 40
		},
		emptyStateText: {
			fontSize: 16,
			color: colors.textSecondary,
			fontWeight: '500'
		},
		taskListContent: {
			paddingBottom: 100
		},
		notesListContent: {
			paddingBottom: 100
		},
		emptyTaskState: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: 40
		}
	}))


	useEffect(() => {
		opacity.value = withTiming(1, { duration: 500 })
	}, [])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value
		}
	}, [opacity])


	const handleRepeatSelect = (value: string) => {
		setSelectedRepeat(value as Task['repeat'])
		repeatBottomSheetRef.current?.dismiss()
	}

	const handleSaveTask = async (taskData: TaskData) => {
		const newTask: Task = {
			id: Date.now().toString(),
			title: taskData.title,
			date: taskData.date || dayjs().format('YYYY-MM-DD'),
			time: taskData.time || '12:00',
			repeat: taskData.repeat,
			reminder: taskData.reminder,
			comment: taskData.comment,
			isCompleted: false,
			notificationTime: taskData.time
		}

		// Если включено уведомление, планируем его
		if (taskData.reminder !== 'Нет' && taskData.date && taskData.time) {
			const notificationId = await scheduleTaskNotification({
				id: newTask.id,
				title: newTask.title,
				date: newTask.date,
				repeat: newTask.repeat,
				notificationTime: newTask.time,
				reminder: newTask.reminder
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

	const handleTaskComplete = useCallback(
		(task: Task, e: GestureResponderEvent) => {
			e.stopPropagation()
			updateTask(task.id, { ...task, isCompleted: !task.isCompleted })
		},
		[updateTask]
	)

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

	const handleAddPress = () => {
		if (mode === 'tasks') {
			taskModalRef.current?.present()
		} else {
			notebookModalRef.current?.present()
		}
	}

	const handleSaveNote = (noteData: { title: string; content: string }) => {
		addNote({
			title: noteData.title,
			content: noteData.content
		})
		notebookModalRef.current?.dismiss()
	}

	const handleNotePress = (note: Note) => {
		router.push({
			pathname: '/note-details',
			params: {
				id: note.id,
				title: note.title,
				content: note.content
			}
		})
	}

	// Мемоизированное вычисление отфильтрованных задач для оптимизации производительности
	const filteredTasks = useMemo(() => {
		return tasks.filter(task => {
			const taskDate = dayjs(task.date).startOf('day')
			const selectedDay = dayjs(selectedDate).startOf('day')

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
					return (
						taskDate.day() === selectedDay.day() &&
						!selectedDay.isBefore(taskDate)
					)
				case 'Ежемесячно':
					return (
						taskDate.date() === selectedDay.date() &&
						!selectedDay.isBefore(taskDate)
					)
				case 'Ежегодно':
					return (
						taskDate.month() === selectedDay.month() &&
						taskDate.date() === selectedDay.date() &&
						!selectedDay.isBefore(taskDate)
					)
				default:
					return false
			}
		})
	}, [tasks, selectedDate]) // Пересчитываем только когда изменяются tasks или selectedDate

	return (
		<ThemedView colorName='background' style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<Animated.View style={[{ flex: 1, margin: 20, paddingBottom: 80 }, animatedStyle]}>
						<Header
							selectedDate={selectedDate}
							onCalendarPress={handleCalendarPresent}
						/>

						<ModeSwitcher currentMode={mode} onModeChange={setMode} />

						{mode === 'tasks' ? (
							<TaskList
								tasks={filteredTasks}
								onTaskPress={handleTaskPress}
								onTaskComplete={handleTaskComplete}
							/>
						) : (
							<View style={{ flex: 1 }}>
								{notes.length === 0 ? (
									<View
										style={{
											flex: 1,
											alignItems: 'center',
											justifyContent: 'center',
											marginTop: 40
										}}
									>
										<ThemedText
											type='secondary'
											style={{ fontSize: 16, fontWeight: '500' as const }}
										>
											У вас пока нет заметок
										</ThemedText>
									</View>
								) : (
									<NotesList notes={notes} onNotePress={handleNotePress} />
								)}
							</View>
						)}

						<TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
							<Feather
								name={mode === 'tasks' ? 'plus' : 'edit-2'}
								size={24}
								color={addButtonIconColor}
							/>
						</TouchableOpacity>
					</Animated.View>

					<TaskModal
						ref={taskModalRef}
						onSave={handleSaveTask}
						onDismiss={() => taskModalRef.current?.dismiss()}
					/>

					<RepeatPickModal
						ref={repeatBottomSheetRef}
						value={selectedRepeat}
						onChange={handleRepeatSelect}
						onDismiss={() => repeatBottomSheetRef.current?.dismiss()}
					/>

					<CalendarPickModal
						ref={calendarRef}
						handleDateChange={handleDateSelect}
						selectedDate={selectedDate}
						handleDismiss={handleCalendarDismiss}
					/>

					<NotebookModal
						ref={notebookModalRef}
						onSave={handleSaveNote}
						onDismiss={() => notebookModalRef.current?.dismiss()}
					/>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</ThemedView>
	)
}

// NoteItem компонент - мемоизированный для оптимизации
const NoteItem = memo(
	({ note, onPress }: { note: Note; onPress: (note: Note) => void }) => {
		const handlePress = useCallback(() => {
			onPress(note)
		}, [note.id, onPress])

		return (
			<TouchableOpacity onPress={handlePress}>
				<ThemedView
					colorName='surface'
					style={{
						padding: 16,
						borderRadius: 12,
						marginBottom: 12,
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<View style={{ flex: 1, marginRight: 12 }}>
						<ThemedText type='defaultSemiBold' numberOfLines={1}>
							{note.title}
						</ThemedText>
						<ThemedText type='secondary' numberOfLines={2}>
							{note.content}
						</ThemedText>
					</View>
				</ThemedView>
			</TouchableOpacity>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.note.id === nextProps.note.id &&
			prevProps.note.title === nextProps.note.title &&
			prevProps.note.content === nextProps.note.content
		)
	}
)

// NotesList компонент - оптимизированный с FlatList
const NotesList = memo(
	({
		notes,
		onNotePress
	}: {
		notes: Note[]
		onNotePress: (note: Note) => void
	}) => {
		const renderNote = useCallback(
			({ item }: ListRenderItemInfo<Note>) => (
				<NoteItem note={item} onPress={onNotePress} />
			),
			[onNotePress]
		)

		const keyExtractor = useCallback((item: Note) => item.id, [])

		return (
			<FlatList
				style={{ flex: 1 }}
				data={notes}
				renderItem={renderNote}
				keyExtractor={keyExtractor}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
				maxToRenderPerBatch={8}
				windowSize={8}
				initialNumToRender={10}
				updateCellsBatchingPeriod={50}
				removeClippedSubviews={true}
				ListEmptyComponent={
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 40
						}}
					>
						<ThemedText
							type='secondary'
							style={{ fontSize: 16, fontWeight: '500' as const }}
						>
							У вас пока нет заметок
						</ThemedText>
					</View>
				}
			/>
		)
	}
)
