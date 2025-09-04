import React, { forwardRef, useCallback, useState, useMemo } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import WheelPickerExpo from 'react-native-wheel-picker-expo'
import Colors from '@/constants/Colors'
import dayjs from 'dayjs'
import BackdropComponent from '../BackdropComponent'

interface TimePickerModalProps {
	value?: string
	onChange: (time: string) => void
	onDismiss: () => void
}

const TimePickerModal = forwardRef<BottomSheetModal, TimePickerModalProps>(
	({ value, onChange, onDismiss }, ref) => {
		// Parse initial time or use current time
		const initialTime = value ? dayjs(`2000-01-01 ${value}`) : dayjs()
		const [selectedHour, setSelectedHour] = useState(initialTime.hour())
		const [selectedMinute, setSelectedMinute] = useState(initialTime.minute())

		// Generate hours (0-23) and minutes (0-59) arrays
		const hours = useMemo(() => 
			Array.from({ length: 24 }, (_, i) => ({
				label: i.toString().padStart(2, '0'),
				value: i
			})), []
		)

		const minutes = useMemo(() => 
			Array.from({ length: 60 }, (_, i) => ({
				label: i.toString().padStart(2, '0'),
				value: i
			})), []
		)

		const handleConfirm = useCallback(() => {
			const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`
			onChange(timeString)
			onDismiss()
		}, [selectedHour, selectedMinute, onChange, onDismiss])

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={['40%']}
				backdropComponent={BackdropComponent}
				enablePanDownToClose
				index={0}
			>
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.title}>Выберите время</Text>
						<TouchableOpacity onPress={handleConfirm}>
							<Text style={styles.doneButton}>Готово</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.pickerContainer}>
						<View style={styles.wheelContainer}>
							<Text style={styles.wheelLabel}>Часы</Text>
							<WheelPickerExpo
								height={180}
								width={80}
								initialSelectedIndex={selectedHour}
								items={hours}
								onChange={({ item }) => setSelectedHour(item.value)}
								selectedStyle={styles.selectedItem}
								haptics={true}
							/>
						</View>

						<Text style={styles.separator}>:</Text>

						<View style={styles.wheelContainer}>
							<Text style={styles.wheelLabel}>Минуты</Text>
							<WheelPickerExpo
								height={180}
								width={80}
								initialSelectedIndex={selectedMinute}
								items={minutes}
								onChange={({ item }) => setSelectedMinute(item.value)}
								selectedStyle={styles.selectedItem}
								haptics={true}
							/>
						</View>
					</View>
				</View>
			</BottomSheetModal>
		)
	}
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.black
	},
	doneButton: {
		fontSize: 17,
		color: Colors.blue,
		fontWeight: '600'
	},
	pickerContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	wheelContainer: {
		alignItems: 'center'
	},
	wheelLabel: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.black,
		marginBottom: 8
	},
	separator: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.black,
		marginHorizontal: 20
	},
	selectedItem: {
		borderColor: Colors.blue,
		borderWidth: 2
	}
})

export default TimePickerModal