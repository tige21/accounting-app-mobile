import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import Colors from '@/constants/Colors'
import CommonInput from '@/components/CommonInput'
import BackButton from '@/components/BackButton'
import { useTaskStore } from '@/store/taskStore'
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton'
import CalendarPickModal from '@/components/CalendarPickModal'

interface Task {
	id: string
	title: string
	date: string
	time: string
	repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
	reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
	comment?: string
}

const getParamSafely = (
	param: string | undefined,
	defaultValue: string
): string => {
	return param || defaultValue
}

const repeatOptions: Task['repeat'][] = [
	'Никогда',
	'Ежедневно',
	'Еженедельно',
	'Ежемесячно',
	'Ежегодно'
]
const reminderOptions: Task['reminder'][] = [
	'Нет',
	'За 1 час',
	'За 1 день',
	'За 1 неделю'
]
export default function EditTaskScreen() {
	const params = useLocalSearchParams<Task>()
	const updateTask = useTaskStore(state => state.updateTask)

	const [editedTask, setEditedTask] = useState<Task>({
		id: getParamSafely(params.id, ''),
		title: getParamSafely(params.title, ''),
		date: getParamSafely(params.date, new Date().toISOString()),
		time: getParamSafely(params.time, '12:00'),
		repeat: (params.repeat as Task['repeat']) || 'Никогда',
		reminder: (params.reminder as Task['reminder']) || 'Нет',
		comment: params.comment || ''
	})

	const handleSave = () => {
		if (editedTask.title.trim()) {
			updateTask(editedTask.id, editedTask)
			router.back()
		}
	}

	const handleBack = () => {
		router.back()
	}

	return (
		<SafeAreaView style={styles.container}>
			<BackButton handleBack={handleBack} />

			<ScrollView style={styles.content}>
				<Text style={styles.title}>Редактировать задачу</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Название</Text>
					<CommonInput
						value={editedTask.title}
						onChangeText={text => setEditedTask({ ...editedTask, title: text })}
						placeholder={editedTask.title}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Комментарий</Text>
					<CommonInput
						onChangeText={text =>
							setEditedTask({ ...editedTask, comment: text })
						}
						placeholder={editedTask.comment || ''}
						value={editedTask.comment || ''}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Время</Text>
					<CommonInput
						value={editedTask.time}
						onChangeText={text => setEditedTask({ ...editedTask, time: text })}
					/>
				</View>

				{/* <View style={styles.inputContainer}>
					<Text style={styles.label}>Повтор</Text>
					{repeatOptions.map(option => (
						<TouchableOpacity
							key={option}
							style={[
								styles.optionButton,
								editedTask.repeat === option && styles.selectedOption
							]}
							onPress={() => setEditedTask({ ...editedTask, repeat: option })}
						>
							<Text
								style={[
									styles.optionText,
									editedTask.repeat === option && styles.selectedOptionText
								]}
							>
								{option}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Напоминание</Text>
					{reminderOptions.map(option => (
						<TouchableOpacity
							key={option}
							style={[
								styles.optionButton,
								editedTask.reminder === option && styles.selectedOption
							]}
							onPress={() => setEditedTask({ ...editedTask, reminder: option })}
						>
							<Text
								style={[
									styles.optionText,
									editedTask.reminder === option && styles.selectedOptionText
								]}
							>
								{option}
							</Text>
						</TouchableOpacity>
					))}
				</View> */}

				<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
					<Text style={styles.saveButtonText}>Сохранить</Text>
				</TouchableOpacity>
			</ScrollView>
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
		padding: 16
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
	commentInput: {
		minHeight: 100,
		textAlignVertical: 'top',
		padding: 8
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
})
