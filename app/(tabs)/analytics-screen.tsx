import React, { useState, useRef, useEffect } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFinanceStore } from '@/store/financeStore'
import Colors from '@/constants/Colors'
import { useTransactionStore } from '@/store/transactionStore'
import dayjs from 'dayjs'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton'
import CalendarPickModal from '@/components/CalendarPickModal'
import UserAvatar from '@/components/UserAvatar'
import { useSettingsStore } from '@/store/settingsStore'
import { useBudgetCalculator } from '@/hooks/useBudgetCalculator'
import AntDesign from '@expo/vector-icons/AntDesign'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useConvertCurrency } from '@/hooks/useConvertCurrency'
import { useFormatting } from '@/hooks/useFormatting'

interface Transaction {
	id: string
	category: string
	price: number
	color: string
	type: 'income' | 'expense'
	date: Date
	description: string
}

export default function AnalyticsScreen() {
	const { transactions, getTotalExpenses, getTotalIncome, deleteTransaction } =
		useTransactionStore()

	const { monthlyBudget, setMonthlyBudget, getCurrentBalance } =
		useFinanceStore()
	const { convertAmount } = useConvertCurrency()

	const { formatCurrency } = useFormatting()

	const [selectedDate, setSelectedDate] = useState(dayjs())
	const [isEditing, setIsEditing] = useState(false)
	const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString())
	const [currentBalance, setCurrentBalance] = useState(getCurrentBalance())

	const daysInMonth = selectedDate.daysInMonth()
	const currentDay = dayjs().date()

	const bottomSheetRef = useRef<BottomSheetModal>(null)

	const opacity = useSharedValue(0)

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 500 })
	}, [])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value
		}
	})

	const handlePresent = () => {
		bottomSheetRef.current?.present()
	}

	const handleDismiss = () => {
		bottomSheetRef.current?.dismiss()
	}

	const handleDateSelect = (date: string) => {
		setSelectedDate(dayjs(date))
		handleDismiss()
	}
	const handleBufferInfoPress = () => {
		Alert.alert(
			'Резерв на непредвиденные расходы',
			'Изменить размер резерва можно в настройках профиля',
			[
				{
					text: 'Понятно',
					style: 'default'
				}
			]
		)
	}

	const { calculateBudgetStats } = useBudgetCalculator()
	const stats = calculateBudgetStats(selectedDate)
	
	const handleDateChange = (days: number) => {
		const newDate = selectedDate.add(days, 'day')
		if (newDate.month() === dayjs().month()) {
			setSelectedDate(newDate)
		}
	}

	const handleLongPress = (transaction: Transaction) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		Alert.alert(
			'Удаление транзакции',
			'Вы уверены, что хотите удалить эту транзакцию?',
			[
				{
					text: 'Отмена',
					style: 'cancel'
				},
				{
					text: 'Удалить',
					onPress: () => {
						deleteTransaction(transaction.id)
					},
					style: 'destructive'
				}
			]
		)
	}

	const renderTransactionItem = (transaction: Transaction) => {
		const convertedAmount = convertAmount(transaction.price)
		
		return (
		  <TouchableOpacity
			key={transaction.id}
			style={[styles.transactionItem, { borderLeftColor: transaction.color }]}
			onLongPress={() => handleLongPress(transaction)}
			delayLongPress={500}
		  >
			<View style={styles.transactionInfo}>
			  <Text style={styles.transactionCategory}>{transaction.category}</Text>
			  <Text style={styles.transactionDescription}>
				{transaction.description}
			  </Text>
			</View>
			<Text
			  style={[
				styles.transactionAmount,
				transaction.type === 'income' ? styles.positive : styles.negative
			  ]}
			>
			  {transaction.type === 'income' ? '+' : '-'}
			  {formatCurrency(convertedAmount)}
			</Text>
		  </TouchableOpacity>
		)
	  }

	// Получение транзакций за выбранный день
	const getDayTransactions = (date: dayjs.Dayjs) => {
		return transactions
		  .filter(t => dayjs(t.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'))
		  .map(transaction => ({
			...transaction,
			convertedPrice: convertAmount(transaction.price)
		  }))
	  }



	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.content}>
				<Animated.View style={[styles.headerRow, animatedStyle]}>
					<UserAvatar />
					<Text style={styles.title}>Аналитика</Text>
				</Animated.View>

				<Animated.View style={[styles.dateNavigator, animatedStyle]}>
					<TouchableOpacity
						style={styles.dateButton}
						onPress={() => handleDateChange(-1)}
					>
						<AntDesign name='arrowleft' size={24} color='white' />
					</TouchableOpacity>

					<View style={styles.dateSelector}>
						<View style={styles.dateDisplay}>
							<Text style={styles.dateText}>
								{selectedDate.locale('ru').format('D MMMM')}
							</Text>
						</View>
						<CalendarPickButton handlePresent={handlePresent} />
					</View>

					<TouchableOpacity
						style={styles.dateButton}
						onPress={() => handleDateChange(1)}
					>
						<AntDesign name='arrowright' size={24} color='white' />
					</TouchableOpacity>
				</Animated.View>

				<Animated.View style={[styles.dailyBudgetCard, animatedStyle]}>
					<Text style={styles.label}>Доступно сегодня</Text>
					<Text style={styles.amount}>{formatCurrency(stats.dailyLimit)}</Text>

					{stats.debt > 0 && (
						<Text style={styles.debtText}>
							Накопленный долг: {formatCurrency(stats.debt)}
						</Text>
					)}

					{stats.daysWithZeroBudget > 0 && (
						<Text style={styles.warningText}>
							Из-за перерасхода следующие {stats.daysWithZeroBudget}{' '}
							{stats.daysWithZeroBudget === 1
								? 'день'
								: stats.daysWithZeroBudget < 5
									? 'дня'
									: 'дней'}{' '}
							будут с нулевым бюджетом
						</Text>
					)}

					<View style={styles.dailyStatsRow}>
						<View>
							<Text style={styles.statsLabel}>Потрачено сегодня</Text>
							<Text style={[styles.statsValue, styles.negative]}>
								{formatCurrency(stats.todaySpent)}
							</Text>
						</View>

						<View>
							<Text style={styles.statsLabel}>Остаток на месяц</Text>
							<Text
								style={[
									styles.statsValue,
									stats.totalBalance >= 0 ? styles.positive : styles.negative
								]}
							>
								{formatCurrency(stats.totalBalance)}
							</Text>
						</View>
					</View>

					<View style={styles.bufferInfo}>
						<View style={styles.bufferHeader}>
							<Text style={styles.statsLabel}>
								Резерв на непредвиденные расходы
							</Text>
							<TouchableOpacity
								onPress={() => {
									handleBufferInfoPress()
								}}
							>
								<Text style={styles.infoIcon}>ⓘ</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.statsValue}>
							{formatCurrency(stats.safetyBuffer)}
						</Text>
						<Text style={styles.bufferDescription}>
							Эта сумма автоматически резервируется для непредвиденных трат
						</Text>
					</View>
				</Animated.View>

				<Animated.View style={[styles.transactionsCard, animatedStyle]}>
          <Text style={styles.cardTitle}>Транзакции за день</Text>

          {getDayTransactions(selectedDate).length > 0 ? (
            <>
              {/* Доходы */}
              {getDayTransactions(selectedDate)
                .filter(t => t.type === 'income')
                .length > 0 && (
                <>
                  <Text style={styles.transactionTypeHeader}>Доходы</Text>
                  {getDayTransactions(selectedDate)
                    .filter(t => t.type === 'income')
                    .map(renderTransactionItem)}
                </>
              )}

              {/* Расходы */}
              {getDayTransactions(selectedDate)
                .filter(t => t.type === 'expense')
                .length > 0 && (
                <>
                  <Text style={styles.transactionTypeHeader}>Расходы</Text>
                  {getDayTransactions(selectedDate)
                    .filter(t => t.type === 'expense')
                    .map(renderTransactionItem)}
                </>
              )}
            </>
          ) : (
            <Text style={styles.noDataText}>Нет транзакций за этот день</Text>
          )}
        </Animated.View>

				<CalendarPickModal
					handleDateChange={handleDateSelect}
					selectedDate={selectedDate.toISOString()}
					handleDismiss={handleDismiss}
					ref={bottomSheetRef}
				/>
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
		padding: 20
	},
	title: {
		fontSize: 28,
		fontWeight: '600',
		color: Colors.black
	},
	budgetCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	balanceCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	balanceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8
	},
	label: {
		fontSize: 16,
		color: Colors.grey_2
	},
	amount: {
		fontSize: 24,
		fontWeight: '600',
		color: Colors.black
	},
	editContainer: {
		marginTop: 8
	},
	progressBar: {
		height: 8,
		backgroundColor: '#E5E5E5',
		borderRadius: 4,
		overflow: 'hidden'
	},
	progress: {
		height: '100%',
		backgroundColor: Colors.blue,
		borderRadius: 4
	},
	statsCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.black,
		marginBottom: 16
	},
	chartContainer: {
		alignItems: 'center',
		marginVertical: 16
	},
	centerLabel: {
		alignItems: 'center'
	},
	centerLabelText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.black
	},
	legendContainer: {
		marginTop: 16
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8
	},
	legendColor: {
		width: 16,
		height: 16,
		borderRadius: 8,
		marginRight: 8
	},
	legendText: {
		fontSize: 14,
		color: Colors.black
	},
	summaryCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8
	},
	summaryLabel: {
		fontSize: 16,
		color: Colors.black
	},
	summaryAmount: {
		fontSize: 16,
		fontWeight: '600'
	},
	positive: {
		color: '#34C759'
	},
	negative: {
		color: '#FF3B30'
	},
	divider: {
		height: 1,
		backgroundColor: '#E5E5E5',
		marginVertical: 8
	},
	noDataText: {
		textAlign: 'center',
		color: Colors.grey_2,
		marginVertical: 24
	},
	dateNavigator: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
		marginTop: 16
	},
	dateSelector: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 12,
		marginHorizontal: 8
	},
	dateDisplay: {
		flex: 1,
		marginRight: 12
	},
	dateButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.blue,
		alignItems: 'center',
		justifyContent: 'center'
	},
	dateButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600'
	},
	dateText: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.black
	},
	dailyBudgetCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	dailyStatsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5'
	},
	statsLabel: {
		fontSize: 14,
		color: Colors.grey_2,
		marginBottom: 4
	},
	statsValue: {
		fontSize: 16,
		fontWeight: '600'
	},
	transactionsCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	transactionTypeHeader: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.black,
		marginTop: 16,
		marginBottom: 8
	},
	transactionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		backgroundColor: '#F8F8F8',
		borderRadius: 8,
		marginBottom: 8,
		borderLeftWidth: 4
	},
	transactionInfo: {
		flex: 1,
		marginRight: 12
	},
	transactionCategory: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.black,
		marginBottom: 4
	},
	transactionDescription: {
		fontSize: 14,
		color: Colors.grey_2
	},
	transactionAmount: {
		fontSize: 16,
		fontWeight: '600'
	},
	header: {
		marginBottom: 24
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	bufferInfo: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5'
	},
	bufferHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	infoIcon: {
		fontSize: 16,
		color: Colors.blue
	},
	bufferDescription: {
		fontSize: 12,
		color: Colors.grey_2,
		marginTop: 4
	},
	warningText: {
		fontSize: 12,
		color: '#FF3B30',
		marginTop: 8
	},
	debtText: {
		fontSize: 12,
		color: '#FF3B30',
		marginTop: 8
	}
})
