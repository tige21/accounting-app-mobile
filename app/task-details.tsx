import React from 'react'
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import ThemedText from '@/components/ThemedText'
import ThemedView from '@/components/ThemedView'
import BackButton from '@/components/BackButton'
import { useTaskStore } from '@/store/taskStore'
import Feather from '@expo/vector-icons/Feather'
import { useDynamicStyles, useThemeColor } from '@/hooks'

const repeatOptions = [
	{ value: 'Никогда', label: 'Не повторять' },
	{ value: 'Ежедневно', label: 'Каждый день' },
	{ value: 'Еженедельно', label: 'Каждую неделю' },
	{ value: 'Ежемесячно', label: 'Каждый месяц' },
	{ value: 'Ежегодно', label: 'Каждый год' }
]

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

export default function TaskDetailsScreen() {
	const params = useLocalSearchParams()
	const task = useTaskStore(state => state.tasks.find(t => t.id === params.id))

	const deleteTask = useTaskStore(state => state.deleteTask)
	const updateTask = useTaskStore(state => state.updateTask)

	const onPrimaryColor = useThemeColor({}, 'onPrimary')
	const textSecondaryColor = useThemeColor({}, 'textSecondary')

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
						deleteTask(params.id as string)
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

	const styles = useDynamicStyles(colors => ({
		container: {
			flex: 1
		},
		content: {
			flex: 1,
			padding: 20
		},
		header: {
			marginBottom: 32
		},
		titleContainer: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginTop: 16
		},
		titleCompleted: {
			textDecorationLine: 'line-through' as const,
			color: colors.textSecondary
		},
		checkbox: {
			width: 24,
			height: 24,
			borderRadius: 12,
			borderWidth: 2,
			borderColor: colors.primary,
			marginRight: 12,
			alignItems: 'center' as const,
			justifyContent: 'center' as const
		},
		checkboxChecked: {
			backgroundColor: colors.primary
		},
		section: {
			marginBottom: 24,
			width: '100%' as const
		},
		commentContainer: {
			borderRadius: 12,
			minHeight: 55,
			maxHeight: 200,
			backgroundColor: colors.surface
		},
		commentScroll: {
			padding: 12
		},
		commentText: {
			fontSize: 16,
			color: colors.textPrimary,
			flexWrap: 'wrap' as const,
			lineHeight: 22
		},
		buttonContainer: {
			marginTop: 'auto' as const,
			gap: 12
		},
		editButton: {
			backgroundColor: colors.primary,
			padding: 16,
			borderRadius: 12,
			alignItems: 'center' as const
		},
		deleteButton: {
			backgroundColor: '#FF3B30',
			padding: 16,
			borderRadius: 12,
			alignItems: 'center' as const
		}
	}))

	return (
		<ThemedView colorName='background' style={styles.container}>
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
									<Feather name='check' size={16} color={onPrimaryColor} />
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
						<ThemedText type="body" style={{ color: textSecondaryColor }}>Дата</ThemedText>
						<ThemedText type="subtitle">{formatDate(params.date as string)}</ThemedText>
					</View>

					<View style={styles.section}>
						<ThemedText type="body" style={{ color: textSecondaryColor }}>Повтор</ThemedText>
						<ThemedText type="subtitle">
							{repeatOptions.find(option => option.value === task?.repeat)?.label || 'Не повторять'}
						</ThemedText>
					</View>

					<View style={styles.section}>
						<ThemedText type="body" style={{ color: textSecondaryColor }}>Комментарий</ThemedText>
						<ThemedView colorName='surface' style={styles.commentContainer}>
							<ScrollView 
								style={styles.commentScroll}
							>
								<ThemedText type="default" style={styles.commentText}>
									{task?.comment || 'Нет комментария'}
								</ThemedText>
							</ScrollView>
						</ThemedView>
					</View>

					{task?.notificationTime && (
						<View style={styles.section}>
							<ThemedText type="body" style={{ color: textSecondaryColor }}>Уведомление</ThemedText>
							<ThemedText type="subtitle">{task.notificationTime}</ThemedText>
						</View>
					)}

					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.editButton} onPress={handleEdit}>
							<ThemedText type="defaultSemiBold" style={{ color: onPrimaryColor }}>Редактировать</ThemedText>
						</TouchableOpacity>
						<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
							<ThemedText type="defaultSemiBold" style={{ color: 'white' }}>Удалить задачу</ThemedText>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</ThemedView>
	)
}

