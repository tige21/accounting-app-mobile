import React, { forwardRef, useMemo, useCallback, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'
import ThemedText from '../ThemedText'
import ThemedView from '../ThemedView'
import BackdropComponent from '../BackdropComponent'
import { useThemeColor, useDynamicStyles } from '@/hooks'
import { createStyles, bottomSheetModalStyles } from './styles'

interface ReminderPickModalProps {
	value?: string
	onChange: (reminder: string) => void
	onDismiss: () => void
}

// Static data for better performance
const REMINDER_OPTIONS = [
	{ value: 'Нет', label: 'Без напоминания', description: null },
	{
		value: 'За 5 минут',
		label: 'За 5 минут',
		description: 'Уведомление за 5 минут до задачи'
	},
	{
		value: 'За 15 минут',
		label: 'За 15 минут',
		description: 'Уведомление за 15 минут до задачи'
	},
	{
		value: 'За 1 час',
		label: 'За 1 час',
		description: 'Уведомление за 1 час до задачи'
	},
	{
		value: 'За 1 день',
		label: 'За 1 день',
		description: 'Уведомление за 1 день до задачи'
	},
	{
		value: 'За 1 неделю',
		label: 'За 1 неделю',
		description: 'Уведомление за 1 неделю до задачи'
	}
]

const ReminderPickModal = memo(
	forwardRef<BottomSheetModal, ReminderPickModalProps>(
		({ value, onChange, onDismiss }, ref) => {
			// Memoized theme colors
			const primaryColor = useThemeColor({}, 'primary')
			const textSecondaryColor = useThemeColor({}, 'textSecondary')

			// Memoized styles
			const styles = useDynamicStyles(createStyles)

			// Optimized callbacks
			const handleOptionSelect = useCallback(
				(optionValue: string) => {
					onChange(optionValue)
					onDismiss()
				},
				[onChange, onDismiss]
			)

			const handleCancel = useCallback(() => {
				onDismiss()
			}, [onDismiss])

			const snapPoints = useMemo(() => ['65%'], [])

			return (
				<BottomSheetModal
					ref={ref}
					snapPoints={snapPoints}
					backdropComponent={BackdropComponent}
					enablePanDownToClose
					index={0}
					accessibilityLabel='Reminder picker modal'
					backgroundStyle={[
						bottomSheetModalStyles.bottomSheetModal,
						{ backgroundColor: styles.container.backgroundColor }
					]}
				>
					<BottomSheetView style={styles.container}>
						{/* Header */}
						<ThemedView colorName='surface' style={styles.header}>
							<TouchableOpacity
								onPress={handleCancel}
								accessibilityRole='button'
								accessibilityLabel='Отменить выбор'
							>
								<ThemedText style={styles.cancelButton}>Отмена</ThemedText>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={handleCancel}
								accessibilityRole='button'
								accessibilityLabel='Подтвердить выбор'
							>
								<ThemedText style={styles.doneButton}>Готово</ThemedText>
							</TouchableOpacity>
						</ThemedView>

						{/* Divider */}
						<ThemedView colorName='surface' style={styles.divider} />

						{/* Content */}
						<ThemedView colorName='surface' style={styles.content}>
							{REMINDER_OPTIONS.map(option => (
								<TouchableOpacity
									key={option.value}
									style={[
										styles.option,
										value === option.value && styles.optionSelected
									]}
									onPress={() => handleOptionSelect(option.value)}
									accessibilityRole='radio'
									accessibilityState={{ checked: value === option.value }}
									accessibilityLabel={`${option.label}${option.description ? `, ${option.description}` : ''}`}
								>
									<ThemedView
										colorName='transparent'
										style={styles.optionContent}
									>
										<ThemedText style={styles.optionText}>
											{option.label}
										</ThemedText>
										{option.description && (
											<ThemedText
												type='secondary'
												style={styles.optionDescription}
											>
												{option.description}
											</ThemedText>
										)}
									</ThemedView>

									{value === option.value && (
										<ThemedView style={styles.checkmarkContainer}>
											<Ionicons name='checkmark' size={18} color='white' />
										</ThemedView>
									)}
								</TouchableOpacity>
							))}
						</ThemedView>
					</BottomSheetView>
				</BottomSheetModal>
			)
		}
	)
)

ReminderPickModal.displayName = 'ReminderPickModal'

export default ReminderPickModal