import React, { forwardRef, useMemo, useCallback, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'
import ThemedText from '../ThemedText'
import ThemedView from '../ThemedView'
import BackdropComponent from '../BackdropComponent'
import { useThemeColor, useDynamicStyles } from '@/hooks'
import { createStyles, bottomSheetModalStyles } from './styles'

interface RepeatPickModalProps {
	value?: string
	onChange: (repeat: string) => void
	onDismiss: () => void
}

// Static data for better performance
const REPEAT_OPTIONS = [
	{ value: 'Никогда', label: 'Не повторять', description: null },
	{
		value: 'Ежедневно',
		label: 'Каждый день',
		description: 'Каждый день в это же время'
	},
	{
		value: 'Еженедельно',
		label: 'Каждую неделю',
		description: 'В этот день каждую неделю'
	},
	{
		value: 'Ежемесячно',
		label: 'Каждый месяц',
		description: 'В это число каждый месяц'
	},
	{
		value: 'Ежегодно',
		label: 'Каждый год',
		description: 'В эту дату каждый год'
	}
]

const RepeatPickModal = memo(
	forwardRef<BottomSheetModal, RepeatPickModalProps>(
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

			const snapPoints = useMemo(() => ['55%'], [])

			return (
				<BottomSheetModal
					ref={ref}
					snapPoints={snapPoints}
					backdropComponent={BackdropComponent}
					enablePanDownToClose
					index={0}
					accessibilityLabel='Repeat picker modal'
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
							{REPEAT_OPTIONS.map(option => (
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

RepeatPickModal.displayName = 'RepeatPickModal'

export default RepeatPickModal
