import Colors from '@/constants/Colors'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView
} from '@gorhom/bottom-sheet'
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
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
	selectedDate: string,
	handleDateChange: (date: string) => void
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
	({ handleDismiss, selectedDate, handleDateChange }, ref) => {
		const snapPoints = useMemo(() => ['60%'], [])
		const [date, setDate] = useState<DateData>(initDateData);

		const [markedDates, setMarkedDates] = useState<MarkedDates>({})
		let currentDate = new Date();
		let dateArray = [
		  new Date(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (3 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (4 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (5 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (8 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (9 * 24 * 60 * 60 * 1000)),
		  new Date(currentDate.getTime() + (10 * 24 * 60 * 60 * 1000))
		];

		useEffect(() => {
			const newMarkedDates = dateArray.reduce((acc, date) => {
				const dateData = dateDataFromDate(date);
				acc[dateData.dateString] = {
					customStyles: {
						text: {
						  color: Colors.blue,
						}
					  }
				}
				acc[selectedDate] = {
					customStyles: {
						container: {
						  backgroundColor: Colors.blue,
						  borderRadius: 5,
						  elevation: 2
						},
						text: {
						  color: Colors.white,
						}
					  }
				}
				return acc;
			}, {} as MarkedDates);
			setMarkedDates(newMarkedDates);
		}, [selectedDate]);

	

		const handleDayPress = (day: DateData) => {
			handleDateChange(day.dateString);
		};

		const handleMarkedDates = (day: DateData) => {
			if (day.dateString === selectedDate) {
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
								markingType={'custom'}
								onDayPress={handleDayPress}
								markedDates={markedDates}

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
