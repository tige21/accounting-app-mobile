import EntertainmentIcon from '@/assets/svg/entertainment-icon'
import HealthIcon from '@/assets/svg/health-icon'
import HouseIcon from '@/assets/svg/house-icon'
import Switcher from '@/components/Switcher'
import React, { useEffect, useState, useMemo } from 'react'
import {
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import { useTransactionStore } from '@/store/transactionStore'
import { getDateRange } from '@/utils/dateUtils'
import TransportIcon from '@/assets/svg/transport-icon'
import PetsIcon from '@/assets/svg/pets-icon'
import BeautyIcon from '@/assets/svg/beauty-icon'
import EducationIcon from '@/assets/svg/education-icon'
import TransactionsIcon from '@/assets/svg/transactions-icon'
import RestaurantsIcon from '@/assets/svg/restaurants-icon'
import GroceriesIcon from '@/assets/svg/groceries-icon'
import PassiveIncomeIcon from '@/assets/svg/passive-income-icon'
import GiftIcon from '@/assets/svg/gift-icon'
import SalaryIcon from '@/assets/svg/salary-icon'
import StockIcon from '@/assets/svg/stock-icon'
import AdvanceIcon from '@/assets/svg/advance-icon'
import FreelanceIcon from '@/assets/svg/freelance-icon'
import CashbackIcon from '@/assets/svg/cashback-icon'
import OtherIcon from '@/assets/svg/other-icon'
import { CATEGORIES } from '@/constants/categories'
import { getCategoryColor } from '@/utils/categoryColors'
import UserAvatar from '@/components/UserAvatar'

interface IData {
	category: string
	price: number
	color: string
}

export default function PieScreen() {
	const transactions = useTransactionStore(store => store.transactions)
	const [selectedTimeFrame, setSelectedTimeFrame] = useState('day')
	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState('1000')

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

	const dataForPie = useMemo(() => {
		return data.map(item => ({
			value: item.price,
			color: item.color
		}))
	}, [data])

	const handleTimeFrameChange = (timeFrame: string) => {
		setSelectedTimeFrame(timeFrame)
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

	if (!data.length) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<View style={styles.headerRow}>
						<UserAvatar />
						<Text style={styles.title}>Расходы</Text>
					</View>
					
					<View style={styles.emptyStateContainer}>
						<Text style={styles.emptyStateText}>
							У вас пока нет расходов.{'\n'}
							Добавьте первую транзакцию, чтобы увидеть статистику.
						</Text>
					</View>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<UserAvatar />
					<Text style={styles.title}>Расходы</Text>
				</View>

				<View style={styles.chartContainer}>
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
					<View style={styles.pieChartWrapper}>
						<PieChart innerRadius={55} radius={90} data={dataForPie} donut />
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
