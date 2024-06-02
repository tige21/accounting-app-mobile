import Colors from '@/constants/Colors'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView
} from '@gorhom/bottom-sheet'
import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {Calendar, CalendarUtils, DateData, LocaleConfig} from 'react-native-calendars'
import { bottomSheetModalStyles } from '@/components/CalendarPickModal/styles'
import styles from './styles'
import { MarkedDates } from 'react-native-calendars/src/types'
import dayjs from "dayjs";

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
}
const dateDataFromDate = (date: Date): DateData => {
	const now = dayjs(date);
	return {
		day: now.date(),
		month: now.month() + 1,
		year: now.year(),
		timestamp: +now,
		dateString: now.format("YYYY-MM-DD"),
	};
};
const initDateData: DateData = dateDataFromDate(new Date());

export type Ref = BottomSheetModal
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
const CalendarPickModal = forwardRef<Ref, CustomBottomSheetModalProps>(
	({ handleDismiss }, ref) => {
		const snapPoints = useMemo(() => ['60%'], [])
		const [date, setDate] = useState<DateData>(initDateData);

		const [selected, setSelected] = useState('')

		const [markedDays, setMarkedDays] = useState({});

		const handleDayPress = (day: DateData) => {
			setSelected(day.dateString);
			if (day.dateString === selected) {
				setMarkedDays({});
			} else {
				setMarkedDays({
					[day.dateString]: {
						selected: true,
						selectedColor: 'orange',
					},
				});
			}
		};

		const handleMarkedDates = (day: DateData) => {
			if (day.dateString === selected) {
				return {
					[day.dateString]: {
						selected: true,
						selectedColor: 'blue',
					},
				};
			}
			return {};
		};
		return (
			<BottomSheetModal
				ref={ref}
				index={0}
				maxDynamicContentSize={500}
				enableHandlePanningGesture
				enableContentPanningGesture
				enableDynamicSizing
				backdropComponent={renderBackdrop()}
				backgroundStyle={bottomSheetModalStyles.bottomSheetModal}
				onDismiss={handleDismiss}
			>
				<BottomSheetView
					style={{
						flex: 1
					}}
				>
					<View style={styles.container}>
						<View style={styles.calendarContainer}>
							<Calendar
								style={styles.calendar}
								onDayPress={handleDayPress}
								markedDates={handleMarkedDates}
							/>
						</View>

						<TouchableOpacity style={styles.saveButton} onPress={handleDismiss}>
							<Text style={styles.saveButtonText}>Сохранить</Text>
						</TouchableOpacity>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		)
	}
)

export default CalendarPickModal
