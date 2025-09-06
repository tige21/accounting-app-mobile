import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import {
	View,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Keyboard,
	Switch
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import BackButton from '@/components/BackButton'
import CommonInput from '@/components/CommonInput'
import Feather from '@expo/vector-icons/Feather'
import { useNoteStore } from '@/store/noteStore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TimePickerModal from '@/components/TimePickerModal'
import CalendarPickModal from '@/components/CalendarPickModal'
import {
	scheduleTaskNotification,
	cancelTaskNotification
} from '@/utils/notifications/index'
import dayjs from 'dayjs'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import RepeatPickModal from '@/components/RepeatPickModal'
import { ThemedView, ThemedText } from '@/components'
import { useDynamicStyles, useThemeColor } from '@/hooks'

interface TodoItem {
	id: string
	text: string
	isCompleted: boolean
	notificationTime?: string
	notificationDate?: string
	notificationId?: string
	repeat?: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
}

interface NoteDetailsParams {
	id: string
	title: string
	content: string
	todos?: TodoItem[]
}

// Выносим TodoItem в отдельный мемоизированный компонент
const TodoItem = memo(
	({
		todo,
		onToggle,
		onDelete,
		onUpdateNotification
	}: {
		todo: TodoItem
		onToggle: (id: string) => void
		onDelete: (id: string) => void
		onUpdateNotification: (
			id: string,
			time?: string,
			date?: string,
			repeat?: string
		) => void
	}) => {
		const primaryColor = useThemeColor({}, 'primary')
		const textPrimaryColor = useThemeColor({}, 'textPrimary')
		const textSecondaryColor = useThemeColor({}, 'textSecondary')
		const surfaceColor = useThemeColor({}, 'surface')
		const timePickerRef = useRef<BottomSheetModal>(null)
		const calendarRef = useRef<BottomSheetModal>(null)
		const repeatBottomSheetRef = useRef<BottomSheetModal>(null)
		const [showActions, setShowActions] = useState(true)

		const handleTimePress = () => {
			Keyboard.dismiss()
			timePickerRef.current?.present()
		}

		const handleCalendarPress = () => {
			Keyboard.dismiss()
			calendarRef.current?.present()
		}

		const handleRepeatPress = () => {
			if (!todo.notificationTime || !todo.notificationDate) {
				Alert.alert(
					'Уведомление не настроено',
					'Сначала настройте время и дату уведомления'
				)
				return
			}
			Keyboard.dismiss()
			repeatBottomSheetRef.current?.present()
		}

		const handleTimeSelect = (time: string) => {
			const date = todo.notificationDate || new Date().toISOString()
			onUpdateNotification(todo.id, time, date, todo.repeat || 'Никогда')
		}

		const handleDateSelect = (date: string) => {
			onUpdateNotification(
				todo.id,
				todo.notificationTime,
				date,
				todo.repeat || 'Никогда'
			)
		}

		const handleRepeatSelect = (repeat: string) => {
			onUpdateNotification(
				todo.id,
				todo.notificationTime,
				todo.notificationDate,
				repeat
			)
		}

		const handleCancelNotification = () => {
			Alert.alert(
				'Отмена уведомления',
				'Вы уверены, что хотите отменить уведомление?',
				[
					{ text: 'Нет', style: 'cancel' },
					{
						text: 'Да',
						onPress: () => {
							onUpdateNotification(todo.id, undefined, undefined, 'Никогда')
						}
					}
				]
			)
		}

		const handleLongPress = () => {
			setShowActions(prev => !prev)
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 8,
					gap: 12,
					flexWrap: 'wrap'
				}}
			>
				<TouchableOpacity
					style={{
						width: 24,
						height: 24,
						borderWidth: 2,
						borderColor: primaryColor,
						borderRadius: 6,
						alignItems: 'center',
						justifyContent: 'center'
					}}
					onPress={() => onToggle(todo.id)}
				>
					{todo.isCompleted && (
						<Feather name='check' size={16} color={primaryColor} />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						flex: 1,
						paddingVertical: 4
					}}
					onLongPress={handleLongPress}
					delayLongPress={500}
				>
					<ThemedText
						style={[
							{
								fontSize: 16,
								flexShrink: 1
							},
							todo.isCompleted && {
								textDecorationLine: 'line-through',
								color: textSecondaryColor
							}
						]}
					>
						{todo.text}
					</ThemedText>
				</TouchableOpacity>

				{showActions && (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 8,
							marginLeft: 'auto'
						}}
					>
						<TouchableOpacity
							style={[
								{
									padding: 8,
									borderRadius: 8,
									backgroundColor: surfaceColor
								},
								todo.notificationTime
									? { backgroundColor: primaryColor + '20' }
									: undefined
							]}
							onPress={handleTimePress}
							onLongPress={
								todo.notificationTime ? handleCancelNotification : undefined
							}
							delayLongPress={500}
						>
							<Feather
								name='bell'
								size={16}
								color={
									todo.notificationTime ? primaryColor : textSecondaryColor
								}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								{
									padding: 8,
									borderRadius: 8,
									backgroundColor: surfaceColor
								},
								todo.notificationDate
									? { backgroundColor: primaryColor + '20' }
									: undefined
							]}
							onPress={handleCalendarPress}
							onLongPress={
								todo.notificationDate ? handleCancelNotification : undefined
							}
							delayLongPress={500}
						>
							<Feather
								name='calendar'
								size={16}
								color={
									todo.notificationDate ? primaryColor : textSecondaryColor
								}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								{
									padding: 8,
									borderRadius: 8,
									backgroundColor: surfaceColor
								},
								todo.repeat && todo.repeat !== 'Никогда'
									? { backgroundColor: primaryColor + '20' }
									: undefined
							]}
							onPress={handleRepeatPress}
							onLongPress={
								todo.repeat && todo.repeat !== 'Никогда'
									? handleCancelNotification
									: undefined
							}
							delayLongPress={500}
						>
							<Feather
								name='repeat'
								size={16}
								color={
									todo.repeat && todo.repeat !== 'Никогда'
										? primaryColor
										: textSecondaryColor
								}
							/>
						</TouchableOpacity>

						{todo.notificationTime && todo.notificationDate && (
							<View
								style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
							>
								<ThemedText
									style={{
										fontSize: 14,
										color: primaryColor,
										backgroundColor: primaryColor + '20',
										paddingHorizontal: 8,
										paddingVertical: 4,
										borderRadius: 6
									}}
								>
									{dayjs(todo.notificationDate).format('DD.MM')}{' '}
									{todo.notificationTime}
								</ThemedText>
								{/* {todo.repeat && todo.repeat !== 'Никогда' && (
                <View style={styles.repeatIconContainer}>
                  <Feather name="repeat" size={14} color={Colors.blue} />
                </View>
              )} */}
							</View>
						)}

						<TouchableOpacity
							style={{ padding: 4 }}
							onPress={() => onDelete(todo.id)}
						>
							<Feather name='x' size={16} color={textSecondaryColor} />
						</TouchableOpacity>
					</View>
				)}

				<TimePickerModal
					ref={timePickerRef}
					value={todo.notificationTime}
					onChange={handleTimeSelect}
					onDismiss={() => timePickerRef.current?.dismiss()}
				/>

				<CalendarPickModal
					ref={calendarRef}
					selectedDate={todo.notificationDate || new Date().toISOString()}
					handleDateChange={handleDateSelect}
					handleDismiss={() => calendarRef.current?.dismiss()}
				/>

				<RepeatPickModal
					ref={repeatBottomSheetRef}
					value={todo.repeat}
					onChange={handleRepeatSelect}
					onDismiss={() => repeatBottomSheetRef.current?.dismiss()}
				/>
			</View>
		)
	}
)

// Выносим хедер в отдельный компонент
const NoteHeader = memo(
	({
		onBack,
		onDelete,
		onConvert,
		showConvert
	}: {
		onBack: () => void
		onDelete: () => void
		onConvert: () => void
		showConvert: boolean
	}) => {
		const primaryColor = useThemeColor({}, 'primary')
		const textSecondaryColor = useThemeColor({}, 'textSecondary')

		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 20
				}}
			>
				<BackButton handleBack={onBack} />
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 16
					}}
				>
					{showConvert && (
						<TouchableOpacity style={{ padding: 4 }} onPress={onConvert}>
							<Feather name='check-square' size={24} color={primaryColor} />
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={onDelete} style={{ padding: 4 }}>
						<Feather name='trash-2' size={24} color={textSecondaryColor} />
					</TouchableOpacity>
				</View>
			</View>
		)
	}
)

export default function NoteDetailsScreen() {
	const params = useLocalSearchParams()
	const { updateNote, deleteNote, getNoteById } = useNoteStore()

	const currentNote = getNoteById(params.id as string)

	const [title, setTitle] = useState(
		currentNote?.title || (params.title as string)
	)
	const [content, setContent] = useState(
		currentNote?.content || (params.content as string)
	)
	const [todos, setTodos] = useState<TodoItem[]>(currentNote?.todos || [])
	const [selectedText, setSelectedText] = useState('')

	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const lastSaveRef = useRef({ title, content, todos })

	const styles = useDynamicStyles(colors => ({
		container: {
			flex: 1
		},
		safeArea: {
			flex: 1
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: 20
		},
		headerActions: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 16
		},
		deleteButton: {
			padding: 4
		},
		content: {
			flex: 1
		},
		scrollContent: {
			padding: 20,
			flexGrow: 1,
			paddingBottom: Platform.OS === 'ios' ? 100 : 80
		},
		titleInput: {
			fontSize: 22,
			fontWeight: '600',
			marginBottom: 16,
			backgroundColor: 'transparent'
		},
		contentInput: {
			fontSize: 17,
			backgroundColor: 'transparent',
			minHeight: 300,
			maxHeight: 2000,
			textAlignVertical: 'top',
			paddingTop: 0
		},
		todosContainer: {
			marginBottom: 16
		},
		todoItem: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: 8,
			gap: 12,
			flexWrap: 'wrap'
		},
		checkbox: {
			width: 24,
			height: 24,
			borderWidth: 2,
			borderColor: colors.primary,
			borderRadius: 6,
			alignItems: 'center',
			justifyContent: 'center'
		},
		todoTextContainer: {
			flex: 1,
			paddingVertical: 4
		},
		todoText: {
			fontSize: 16,
			color: colors.textPrimary,
			flexShrink: 1
		},
		todoTextCompleted: {
			textDecorationLine: 'line-through',
			color: colors.textSecondary
		},
		deleteIcon: {
			padding: 4
		},
		convertButton: {
			padding: 4
		},
		bottomPadding: {
			height: 100
		},
		todoActions: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
			marginLeft: 'auto'
		},
		iconButton: {
			padding: 8,
			borderRadius: 8,
			backgroundColor: colors.surface
		},
		iconButtonActive: {
			backgroundColor: colors.primary + '20'
		},
		notificationInfo: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 4
		},
		notificationText: {
			fontSize: 14,
			color: colors.primary,
			backgroundColor: colors.primary + '20',
			paddingHorizontal: 8,
			paddingVertical: 4,
			borderRadius: 6
		},
		repeatIconContainer: {
			backgroundColor: colors.primary + '20',
			padding: 4,
			borderRadius: 6
		}
	}))

	// Обновляем эффект автосохранения, чтобы сохранять todos
	useEffect(() => {
		const hasChanges =
			title !== lastSaveRef.current.title ||
			content !== lastSaveRef.current.content ||
			JSON.stringify(todos) !== JSON.stringify(lastSaveRef.current.todos) // Сравниваем todos

		if (hasChanges) {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current)
			}

			saveTimeoutRef.current = setTimeout(() => {
				updateNote(params.id as string, {
					title,
					content,
					todos, // Сохраняем todos
					updatedAt: new Date().toISOString()
				})
				lastSaveRef.current = { title, content, todos }
			}, 500)
		}

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current)
			}
		}
	}, [title, content, todos, params.id, updateNote])

	// Добавим слушатель клавиатуры
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				scrollViewRef.current?.scrollToEnd({ animated: true })
			}
		)

		return () => {
			keyboardDidShowListener.remove()
		}
	}, [])

	const scrollViewRef = useRef<ScrollView>(null)

	// Мемоизируем обработчики
	const handleBack = useCallback(() => {
		router.back()
	}, [])

	// Обновляем обработчик конвертации текста в todos
	const handleConvertToTodos = useCallback(() => {
		if (!selectedText) return

		const newTodos = selectedText
			.split('\n')
			.filter(text => text.trim())
			.map(text => ({
				id: Date.now().toString() + Math.random(),
				text: text.trim(),
				isCompleted: false,
				notificationTime: undefined,
				notificationDate: undefined,
				notificationId: undefined
			}))

		setTodos(prev => [...prev, ...newTodos])
		setContent(prev => prev.replace(selectedText, ''))
		setSelectedText('')
	}, [selectedText])

	const handleToggleTodo = useCallback((id: string) => {
		setTodos(prev =>
			prev.map(todo =>
				todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
			)
		)
	}, [])

	// Обновляем обработчик обновления уведомлений
	const handleUpdateNotification = async (
		todoId: string,
		time?: string,
		date?: string,
		repeat?: string
	) => {
		const updatedTodos = todos.map(todo => {
			if (todo.id === todoId) {
				// Отменяем существующее уведомление
				if (todo.notificationId) {
					cancelTaskNotification(todo.notificationId)
				}

				if (!time || !date) {
					return {
						...todo,
						notificationTime: undefined,
						notificationDate: undefined,
						notificationId: undefined,
						repeat: 'Никогда' as const
					}
				}

				return {
					...todo,
					notificationTime: time,
					notificationDate: date,
					repeat: (repeat || 'Никогда') as TodoItem['repeat'],
					notificationId: undefined
				}
			}
			return todo
		})

		const todoToUpdate = updatedTodos.find(t => t.id === todoId)
		if (
			todoToUpdate &&
			todoToUpdate.notificationTime &&
			todoToUpdate.notificationDate
		) {
			try {
				const notificationId = await scheduleTaskNotification({
					id: todoToUpdate.id,
					title: `${currentNote?.title || 'Заметка'}: ${todoToUpdate.text}`,
					date: todoToUpdate.notificationDate,
					notificationTime: todoToUpdate.notificationTime,
					repeat: todoToUpdate.repeat || 'Никогда'
				})

				if (notificationId) {
					const finalTodos = updatedTodos.map(t =>
						t.id === todoId
							? {
									...t,
									notificationId,
									notificationTime: todoToUpdate.notificationTime,
									notificationDate: todoToUpdate.notificationDate,
									repeat: todoToUpdate.repeat
								}
							: t
					)
					setTodos(finalTodos)

					// Сразу сохраняем в store
					updateNote(params.id as string, {
						...currentNote,
						todos: finalTodos,
						updatedAt: new Date().toISOString()
					})
					return
				}
			} catch (error) {
				console.error('Error scheduling notification:', error)
			}
		}

		setTodos(updatedTodos)
		// Сохраняем и при неудачном создании уведомления
		updateNote(params.id as string, {
			...currentNote,
			todos: updatedTodos,
			updatedAt: new Date().toISOString()
		})
	}

	// Добавляем эффект для отмены уведомлений при удалении todo
	const handleDeleteTodo = useCallback(
		async (id: string) => {
			const todoToDelete = todos.find(todo => todo.id === id)
			if (todoToDelete?.notificationId) {
				await cancelTaskNotification(todoToDelete.notificationId)
			}
			setTodos(prev => prev.filter(todo => todo.id !== id))
		},
		[todos]
	)

	// Добавляем эффект для отмены всех уведомлений при удалении заметки
	const handleDelete = useCallback(() => {
		Alert.alert(
			'Удаление заметки',
			'Вы уверены, что хотите удалить эту заметку?',
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Удалить',
					style: 'destructive',
					onPress: async () => {
						// Отменяем все уведомления перед удалением
						await Promise.all(
							todos
								.filter(todo => todo.notificationId)
								.map(todo => cancelTaskNotification(todo.notificationId!))
						)
						deleteNote(params.id as string)
						router.back()
					}
				}
			]
		)
	}, [params.id, todos, deleteNote])

	return (
		<ThemedView colorName='background' style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<NoteHeader
					onBack={handleBack}
					onDelete={handleDelete}
					onConvert={handleConvertToTodos}
					showConvert={!!selectedText}
				/>

				<KeyboardAwareScrollView
					style={styles.content}
					enableOnAndroid
					enableAutomaticScroll
					extraScrollHeight={Platform.OS === 'ios' ? 100 : 80}
					keyboardShouldPersistTaps='handled'
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
					enableResetScrollToCoords={false}
					scrollEnabled={true}
					keyboardOpeningTime={0}
					nestedScrollEnabled={true}
				>
					<CommonInput
						placeholder='Название'
						value={title}
						onChangeText={setTitle}
						style={styles.titleInput}
					/>

					{todos.length > 0 && (
						<ThemedView style={styles.todosContainer}>
							{todos.map(todo => (
								<TodoItem
									key={todo.id}
									todo={todo}
									onToggle={handleToggleTodo}
									onDelete={handleDeleteTodo}
									onUpdateNotification={handleUpdateNotification}
								/>
							))}
						</ThemedView>
					)}

					<CommonInput
						placeholder='Начните вводить текст...'
						value={content}
						onChangeText={setContent}
						onSelectionChange={event => {
							const { start, end } = event.nativeEvent.selection
							setSelectedText(content.slice(start, end))
						}}
						multiline
						textAlignVertical='top'
						style={styles.contentInput}
						blurOnSubmit={false}
						scrollEnabled={false}
					/>
					<View style={styles.bottomPadding} />
				</KeyboardAwareScrollView>
			</SafeAreaView>
		</ThemedView>
	)
}
