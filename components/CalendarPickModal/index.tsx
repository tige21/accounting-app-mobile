import {
	BottomSheetModal,
	BottomSheetView
} from '@gorhom/bottom-sheet'
import React, { forwardRef, useEffect, useState, useMemo, memo, useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons'
import { bottomSheetModalStyles, createStyles } from '@/components/CalendarPickModal/styles'
import { MarkedDates } from 'react-native-calendars/src/types'
import ThemedText from '../ThemedText'
import ThemedView from '../ThemedView'
import { useThemeColor, useDynamicStyles } from '@/hooks'
import BackdropComponent from '../BackdropComponent'

LocaleConfig.locales['ru'] = {
	monthNames: [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	],
	monthNamesShort: [
		'Янв.',
		'Февр.',
		'Март',
		'Апр.',
		'Май',
		'Июнь',
		'Июль',
		'Авг.',
		'Сент.',
		'Окт.',
		'Нояб.',
		'Дек.'
	],
	dayNames: [
		'Воскресенье',
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота'
	],
	dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	today: 'Сегодня'
}

LocaleConfig.defaultLocale = 'ru'

interface CustomBottomSheetModalProps {
	handleDismiss: () => void
	selectedDate: string,
	handleDateChange: (date: string) => void
}

export type Ref = BottomSheetModal

const CalendarPickModal = memo(forwardRef<Ref, CustomBottomSheetModalProps>(
	({ handleDismiss, selectedDate, handleDateChange }, ref) => {
		// Memoized theme colors
		const primaryColor = useThemeColor({}, 'primary')
		const onPrimaryColor = useThemeColor({}, 'onPrimary')
		const textPrimaryColor = useThemeColor({}, 'textPrimary')
		const textSecondaryColor = useThemeColor({}, 'textSecondary')
		const surfaceColor = useThemeColor({}, 'surface')
		
		
		const styles = useDynamicStyles((colors) => createStyles(colors))
		

		const [markedDates, setMarkedDates] = useState<MarkedDates>({} as MarkedDates)
		
		// Memoized marked dates calculation
		const markedDatesConfig = useMemo(() => {
			const newMarkedDates: MarkedDates = {}
			if (selectedDate) {
				newMarkedDates[selectedDate] = {
					customStyles: {
						container: {
							backgroundColor: primaryColor,
							borderRadius: 8,
							elevation: 2
						},
						text: {
							color: onPrimaryColor,
							fontWeight: '600'
						}
					}
				}
			}
			return newMarkedDates
		}, [selectedDate, primaryColor, onPrimaryColor])

		useEffect(() => {
			setMarkedDates(markedDatesConfig)
		}, [markedDatesConfig])

	

		// Optimized callbacks
		const handleDayPress = useCallback((day: DateData) => {
			handleDateChange(day.dateString)
		}, [handleDateChange])

		const handleSave = useCallback(() => {
			handleDismiss()
		}, [handleDismiss])

		const snapPoints = useMemo(() => ['65%'], [])

		// Memoized calendar theme
		const calendarTheme = useMemo(() => ({
			backgroundColor: surfaceColor,
			calendarBackground: surfaceColor,
			textSectionTitleColor: textPrimaryColor,
			selectedDayBackgroundColor: primaryColor,
			selectedDayTextColor: onPrimaryColor,
			todayTextColor: primaryColor,
			dayTextColor: textPrimaryColor,
			textDisabledColor: textSecondaryColor + '60',
			dotColor: primaryColor,
			selectedDotColor: onPrimaryColor,
			arrowColor: primaryColor,
			monthTextColor: textPrimaryColor,
			indicatorColor: primaryColor,
			textDayFontWeight: '500' as const,
			textMonthFontWeight: 'bold' as const,
			textDayHeaderFontWeight: '500' as const,
			textDayFontSize: 16,
			textMonthFontSize: 18,
			textDayHeaderFontSize: 14
		}), [surfaceColor, textPrimaryColor, primaryColor, onPrimaryColor, textSecondaryColor])

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={snapPoints}
				backdropComponent={BackdropComponent}
				enablePanDownToClose
				index={0}
				accessibilityLabel="Calendar picker modal"
				backgroundStyle={[bottomSheetModalStyles.bottomSheetModal, { backgroundColor: styles.container.backgroundColor }]}
				onDismiss={handleDismiss}
			>
				<BottomSheetView style={styles.container}>
					{/* Header */}
					<ThemedView colorName="surface" style={styles.header}>
						<ThemedView colorName="surface" style={styles.headerContent}>
							<Ionicons 
								name="calendar-outline" 
								size={24} 
								color={primaryColor} 
								style={styles.headerIcon}
							/>
							<ThemedText type="heading" style={styles.title}>Выберите дату</ThemedText>
						</ThemedView>
						<TouchableOpacity 
							onPress={handleSave}
							style={styles.closeButton}
							accessibilityRole="button"
							accessibilityLabel="Закрыть модальное окно"
						>
							<Ionicons name="close" size={24} color={textSecondaryColor} />
						</TouchableOpacity>
					</ThemedView>

					{/* Divider */}
					<ThemedView colorName="surface" style={styles.divider} />

					{/* Calendar */}
					<ThemedView colorName="surface" style={styles.calendarContainer}>
						<Calendar
							style={styles.calendar}
							markingType={'custom'}
							onDayPress={handleDayPress}
							markedDates={markedDates}
							theme={calendarTheme}
							firstDay={1}
							enableSwipeMonths={true}
						/>
					</ThemedView>

					

					{/* Footer */}
					<ThemedView colorName="surface" style={styles.footer}>
						<TouchableOpacity 
							style={styles.saveButton} 
							onPress={handleSave}
							accessibilityRole="button"
							accessibilityLabel="Сохранить выбранную дату"
						>
							<ThemedText style={styles.saveButtonText}>Сохранить</ThemedText>
						</TouchableOpacity>
					</ThemedView>
				</BottomSheetView>
			</BottomSheetModal>
		)
	}
))

CalendarPickModal.displayName = 'CalendarPickModal'

export default CalendarPickModal
