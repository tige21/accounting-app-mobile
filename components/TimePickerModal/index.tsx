import React, { forwardRef, useCallback, useState, useMemo, memo } from 'react'
import {
	TouchableOpacity,
	Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import WheelPickerExpo from 'react-native-wheel-picker-expo'
import dayjs from 'dayjs'
import { Ionicons } from '@expo/vector-icons'
import BackdropComponent from '../BackdropComponent'
import ThemedText from '../ThemedText'
import ThemedView from '../ThemedView'
import { useDynamicStyles, useThemeColor } from '@/hooks'
import { createStyles, bottomSheetModalStyles } from './styles'

interface TimePickerModalProps {
	value?: string
	onChange: (time: string) => void
	onDismiss: () => void
}

// Static data - generated once and reused
const HOURS_DATA = Array.from({ length: 24 }, (_, i) => ({
	label: i.toString().padStart(2, '0'),
	value: i
}))

const MINUTES_DATA = Array.from({ length: 60 }, (_, i) => ({
	label: i.toString().padStart(2, '0'),
	value: i
}))

// Memoized WheelContainer component for optimal performance
const MemoizedWheelContainer = memo<{
	items: Array<{ label: string; value: number }>
	selectedIndex: number
	onChange: (item: { item: { value: number } }) => void
	label: string
	styles: any
}>(({ items, selectedIndex, onChange, label, styles }) => {
	return (
		<ThemedView colorName="surfaceSecondary" style={styles.wheelContainer}>
			<ThemedText type="secondary" style={styles.wheelLabel}>{label}</ThemedText>
			<WheelPickerExpo
				height={160}
				width={70}
				initialSelectedIndex={selectedIndex}
				items={items}
				onChange={onChange}
				selectedStyle={styles.selectedWheelItem}
				haptics={false}
			/>
		</ThemedView>
	)
})

MemoizedWheelContainer.displayName = 'MemoizedWheelContainer'

const TimePickerModal = memo(forwardRef<BottomSheetModal, TimePickerModalProps>(
	({ value, onChange, onDismiss }, ref) => {
		// Parse initial time or use current time
		const initialTime = useMemo(() => {
			return value ? dayjs(`2000-01-01 ${value}`) : dayjs()
		}, [value])
		
		// For iOS native DatePicker
		const [nativeDate, setNativeDate] = useState(() => {
			const date = new Date()
			date.setHours(initialTime.hour())
			date.setMinutes(initialTime.minute())
			return date
		})
		
		// For Android WheelPicker
		const [selectedHour, setSelectedHour] = useState(initialTime.hour())
		const [selectedMinute, setSelectedMinute] = useState(initialTime.minute())

		// Memoized theme colors to prevent unnecessary hook calls
		const primaryColor = useThemeColor({}, 'primary')

		// Optimized callbacks for Android WheelPicker
		const handleHourChange = useCallback(({ item }: { item: { value: number } }) => {
			setSelectedHour(item.value)
		}, [])

		const handleMinuteChange = useCallback(({ item }: { item: { value: number } }) => {
			setSelectedMinute(item.value)
		}, [])

		// Callback for iOS DatePicker
		const handleNativeDateChange = useCallback((_: any, selectedDate?: Date) => {
			if (selectedDate) {
				setNativeDate(selectedDate)
			}
		}, [])

		const handleConfirm = useCallback(() => {
			let timeString: string
			if (Platform.OS === 'ios') {
				timeString = dayjs(nativeDate).format('HH:mm')
			} else {
				timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`
			}
			onChange(timeString)
			onDismiss()
		}, [selectedHour, selectedMinute, nativeDate, onChange, onDismiss])

		const snapPoints = useMemo(() => ['45%'], [])

		// Memoized styles to prevent recalculation
		const styles = useDynamicStyles(createStyles)

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={snapPoints}
				backdropComponent={BackdropComponent}
				enablePanDownToClose
				index={0}
				enabledDynamicSizing={false}
				accessibilityLabel="Time picker modal"
				backgroundStyle={[bottomSheetModalStyles.bottomSheetModal, { backgroundColor: styles.container.backgroundColor }]}
			>
				<BottomSheetView style={styles.container}>
					{/* Header */}
					<ThemedView colorName="surface" style={styles.header}>
						<ThemedView colorName="surface" style={styles.headerContent}>
							<Ionicons 
								name="time-outline" 
								size={24} 
								color={primaryColor} 
								style={styles.headerIcon}
							/>
							<ThemedText type="heading" style={styles.title}>Выберите время</ThemedText>
						</ThemedView>
						<TouchableOpacity 
							onPress={handleConfirm}
							accessibilityRole="button"
							accessibilityLabel="Подтвердить выбор времени"
						>
							<ThemedText style={styles.doneButton}>Готово</ThemedText>
						</TouchableOpacity>
					</ThemedView>

					{/* Divider */}
					<ThemedView colorName="surface" style={styles.divider} />

					{/* Time Picker - Platform specific */}
					<ThemedView colorName="surface" style={styles.pickerContainer}>
						{Platform.OS === 'ios' ? (
							// iOS Native DatePicker
							<ThemedView colorName="surface" style={styles.nativeDatePickerContainer}>
								<DateTimePicker
									value={nativeDate}
									mode="time"
									display="spinner"
									onChange={handleNativeDateChange}
									style={styles.nativeDatePicker}
									textColor={primaryColor}
									locale="ru-RU"
								/>
							</ThemedView>
						) : (
							// Android WheelPicker
							<>
								<MemoizedWheelContainer
									items={HOURS_DATA}
									selectedIndex={selectedHour}
									onChange={handleHourChange}
									label="Часы"
									styles={styles}
								/>

								<ThemedText style={styles.separator}>:</ThemedText>

								<MemoizedWheelContainer
									items={MINUTES_DATA}
									selectedIndex={selectedMinute}
									onChange={handleMinuteChange}
									label="Минуты"
									styles={styles}
								/>
							</>
						)}
					</ThemedView>

				</BottomSheetView>
			</BottomSheetModal>
		)
	}
))

TimePickerModal.displayName = 'TimePickerModal'

export default TimePickerModal