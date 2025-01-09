import EducationIcon from '@/assets/svg/education-icon'
import HealthIcon from '@/assets/svg/health-icon'
import HouseIcon from '@/assets/svg/house-icon'
import OtherIcon from '@/assets/svg/other-icon'
import RestaurantsIcon from '@/assets/svg/restaurants-icon'
import TransportIcon from '@/assets/svg/transport-icon'
import Switcher from '@/components/Switcher'
import React, { useMemo, useRef, useState } from 'react'
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CustomBottomSheetModal from '@/components/CalendarPickModal'
import Index from '@/components/CalendarPickModal'
import { useTransactionStore } from '@/store/transactionStore'
import { getDateRange } from '@/utils/dateUtils'
import { getCategoryColor } from '@/utils/categoryColors'
import PetsIcon from '@/assets/svg/pets-icon'
import BeautyIcon from '@/assets/svg/beauty-icon'
import TransactionsIcon from '@/assets/svg/transactions-icon'
import EntertainmentIcon from '@/assets/svg/entertainment-icon'
import GroceriesIcon from '@/assets/svg/groceries-icon'
import PassiveIncomeIcon from '@/assets/svg/passive-income-icon'
import GiftIcon from '@/assets/svg/gift-icon'
import SalaryIcon from '@/assets/svg/salary-icon'
import StockIcon from '@/assets/svg/stock-icon'
import AdvanceIcon from '@/assets/svg/advance-icon'
import FreelanceIcon from '@/assets/svg/freelance-icon'
import CashbackIcon from '@/assets/svg/cashback-icon'
import { CATEGORIES } from '@/constants/categories'
import UserAvatar from '@/components/UserAvatar'

interface IBarData {
	category: string
	price: number
	color: string
	icon: JSX.Element
}

export default function BarScreen() {
	const { transactions } = useTransactionStore()
	const [selectedTimeFrame, setSelectedTimeFrame] = useState('day')
	const [text, setText] = useState('1000')
	const [isEditing, setIsEditing] = useState(false)

	const getFilteredData = () => {
		const { start, end } = getDateRange(
			selectedTimeFrame as 'day' | 'week' | 'month' | 'year'
		)

		return transactions.filter(t => {
			const transactionDate = new Date(t.date)
			return (
				transactionDate >= start &&
				transactionDate <= end &&
				t.type === 'expense'
			)
		})
	}

	const data = useMemo(() => {
		const filteredTransactions = getFilteredData()
		return filteredTransactions.reduce(
			(acc, curr) => {
				const existing = acc.find(item => item.category === curr.category)
				if (existing) {
					existing.price += curr.price
				} else {
					acc.push({
						category: curr.category,
						price: curr.price,
						color: getCategoryColor(curr.category)
					})
				}
				return acc
			},
			[] as Array<{ category: string; price: number; color: string }>
		)
	}, [transactions, selectedTimeFrame])

	const transformData = () => {
		const filteredTransactions = getFilteredData()
		const groupedData = filteredTransactions.reduce((acc, curr) => {
			const existing = acc.find(item => item.category === curr.category)
			if (existing) {
				existing.price += curr.price
			} else {
				acc.push({
					category: curr.category,
					price: curr.price,
					color: getCategoryColor(curr.category),
					icon: getIconForCategory(curr.category)
				})
			}
			return acc
		}, [] as IBarData[])

		return groupedData.map(item => ({
			value: item.price,
			spacing: 20,
			topLabelComponent: () => (
				<View style={{ marginBottom: 6 }}>{item.icon}</View>
			),
			frontColor: item.color
		}))
	}

	const getIconForCategory = (category: string) => {
		const color = getCategoryColor(category)

		switch (category) {
			// Расходы
			case CATEGORIES.EXPENSES.HEALTH:
				return <HealthIcon color={color} />
			case CATEGORIES.EXPENSES.TRANSPORT:
				return <TransportIcon color={color} />
			case CATEGORIES.EXPENSES.PETS:
				return <PetsIcon color={color} />
			case CATEGORIES.EXPENSES.BEAUTY:
				return <BeautyIcon color={color} />
			case CATEGORIES.EXPENSES.EDUCATION:
				return <EducationIcon color={color} />
			case CATEGORIES.EXPENSES.TRANSFERS:
				return <TransactionsIcon color={color} />
			case CATEGORIES.EXPENSES.CAFE:
				return <RestaurantsIcon color={color} />
			case CATEGORIES.EXPENSES.ENTERTAINMENT:
				return <EntertainmentIcon color={color} />
			case CATEGORIES.EXPENSES.GROCERIES:
				return <GroceriesIcon color={color} />
			case CATEGORIES.EXPENSES.HOUSE:
				return <HouseIcon color={color} />
			// Доходы
			case CATEGORIES.INCOME.PASSIVE:
				return <PassiveIncomeIcon color={color} />
			case CATEGORIES.INCOME.GIFT:
				return <GiftIcon color={color} />
			case CATEGORIES.INCOME.SALARY:
				return <SalaryIcon color={color} />
			case CATEGORIES.INCOME.STOCKS:
				return <StockIcon color={color} />
			case CATEGORIES.INCOME.ADVANCE:
				return <AdvanceIcon color={color} />
			case CATEGORIES.INCOME.FREELANCE:
				return <FreelanceIcon color={color} />
			case CATEGORIES.INCOME.CASHBACK:
				return <CashbackIcon color={color} />
			default:
				return <OtherIcon color={color} />
		}
	}

	const handleEdit = () => {
		setIsEditing(true)
	}

	const handleSave = () => {
		setIsEditing(false)
	}

	const handleChange = (value: string) => {
		setText(value)
	}

	const bottomSheetRef = useRef<BottomSheetModal>(null)

	const handleDismiss = () => {
		bottomSheetRef.current?.dismiss()
	}

	const handlePresent = () => {
		bottomSheetRef.current?.present()
	}

	const handleTimeFrameChange = (timeFrame: string) => {
		setSelectedTimeFrame(timeFrame as 'day' | 'week' | 'month' | 'year')
	}

	const chartData = transformData()

	if (!data.length) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<View style={styles.headerRow}>
						<UserAvatar />
						<Text style={styles.title}>Статистика</Text>
					</View>

					<View style={styles.emptyStateContainer}>
						<Text style={styles.emptyStateText}>
							У вас пока нет транзакций.{'\n'}
							Добавьте первую транзакцию, чтобы увидеть статистику.
						</Text>
					</View>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1, marginBottom: 5 }}>
			<View style={{ flex: 1, marginHorizontal: 16, marginVertical: 18 }}>
				<View style={styles.headerRow}>
					<UserAvatar />
					<Text style={styles.title}>Статистика</Text>
				</View>

				<View style={styles.chartStatsContainer}>
					<View style={styles.graphicsNames}>
						<TouchableOpacity onPress={() => handleTimeFrameChange('day')}>
							<Text
								style={[
									styles.graphicName,
									selectedTimeFrame === 'day' && { color: '#177AD5' }
								]}
							>
								День
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleTimeFrameChange('week')}>
							<Text
								style={[
									styles.graphicName,
									selectedTimeFrame === 'week' && { color: '#177AD5' }
								]}
							>
								Неделя
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleTimeFrameChange('month')}>
							<Text
								style={[
									styles.graphicName,
									selectedTimeFrame === 'month' && { color: '#177AD5' }
								]}
							>
								Месяц
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleTimeFrameChange('year')}>
							<Text
								style={[
									styles.graphicName,
									selectedTimeFrame === 'year' && { color: '#177AD5' }
								]}
							>
								Год
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ padding: 20 }}>
						<BarChart
							data={chartData}
							barWidth={17}
							spacing={20}
							hideRules
							hideYAxisText
							hideAxesAndRules
							maxValue={Math.max(...chartData.map(item => item.value)) * 1.2}
							noOfSections={3}
							width={300}
							height={250}
							yAxisThickness={0}
							xAxisThickness={0}
							barBorderRadius={4}
						/>
					</View>
				</View>
				<ScrollView style={styles.transactions}>
					{data.map((item, index) => (
						<View key={index} style={styles.transactionItem}>
							<View style={styles.categoryWrapper}>
								<View style={styles.categoryIcon}>
									{getIconForCategory(item.category)}
								</View>
								<Text style={styles.categoryText}>{item.category}</Text>
							</View>
							<Text style={styles.priceText}>{item.price} P</Text>
						</View>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	)
}
