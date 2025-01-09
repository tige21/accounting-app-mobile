import CustomBottomSheetModal from '@/components/CalendarPickModal'
import Colors from '@/constants/Colors'
import { Feather } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Picker } from '@react-native-picker/picker'
import React, { useRef, useState } from 'react'
import {
	KeyboardAvoidingView,
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	Button,
	Alert
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import HealthIcon from '@/assets/svg/health-icon'
import TransportIcon from '@/assets/svg/transport-icon'
import EducationIcon from '@/assets/svg/education-icon'
import RestaurantsIcon from '@/assets/svg/restaurants-icon'
import EntertainmentIcon from '@/assets/svg/entertainment-icon'
import HouseIcon from '@/assets/svg/house-icon'
import GroceriesIcon from '@/assets/svg/groceries-icon'
import OtherIcon from '@/assets/svg/other-icon'
import BeautyIcon from '@/assets/svg/beauty-icon'
import PetsIcon from '@/assets/svg/pets-icon'
import TransactionsIcon from '@/assets/svg/transactions-icon'
import PassiveIncomeIcon from '@/assets/svg/passive-income-icon'
import GiftIcon from '@/assets/svg/gift-icon'
import SalaryIcon from '@/assets/svg/salary-icon'
import StockIcon from '@/assets/svg/stock-icon'
import AdvanceIcon from '@/assets/svg/advance-icon'
import FreelanceIcon from '@/assets/svg/freelance-icon'
import CashbackIcon from '@/assets/svg/cashback-icon'
import { router } from 'expo-router'
import CommonButton from '@/components/CommonButton'
import iconSet from '@expo/vector-icons/build/Fontisto'
import CategoryButton, {
	ICategoryButtonProps
} from '@/components/CategoryButton'
import { ECatogories } from '@/constants/enums'
import { CommonInput } from '@/components'
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton'
import BackButton from '@/components/BackButton'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/ru'
import { useTransactionStore } from '@/store/transactionStore'
import { getCategoryColor } from '@/utils/categoryColors'
import { CATEGORIES } from '@/constants/categories'
import CalendarPickModal from '@/components/CalendarPickModal'

dayjs.locale('ru')
dayjs.extend(localeData)

const INITIAL_DATE = new Date()

const categories = {
	[ECatogories.EXPENSES]: [
		{ id: 0, title: CATEGORIES.EXPENSES.HEALTH, icon: <HealthIcon /> },
		{ id: 1, title: CATEGORIES.EXPENSES.TRANSPORT, icon: <TransportIcon /> },
		{ id: 2, title: CATEGORIES.EXPENSES.PETS, icon: <PetsIcon /> },
		{ id: 3, title: CATEGORIES.EXPENSES.BEAUTY, icon: <BeautyIcon /> },
		{ id: 4, title: CATEGORIES.EXPENSES.EDUCATION, icon: <EducationIcon /> },
		{
			id: 5,
			title: CATEGORIES.EXPENSES.TRANSFERS,
			icon: <TransactionsIcon />
		},
		{ id: 6, title: CATEGORIES.EXPENSES.CAFE, icon: <RestaurantsIcon /> },
		{
			id: 7,
			title: CATEGORIES.EXPENSES.ENTERTAINMENT,
			icon: <EntertainmentIcon />
		},
		{ id: 8, title: CATEGORIES.EXPENSES.GROCERIES, icon: <GroceriesIcon /> },
		{ id: 9, title: CATEGORIES.EXPENSES.HOUSE, icon: <HouseIcon /> },
		{ id: 10, title: CATEGORIES.EXPENSES.OTHER, icon: <OtherIcon /> }
	],
	[ECatogories.INCOME]: [
		{ id: 11, title: CATEGORIES.INCOME.PASSIVE, icon: <PassiveIncomeIcon /> },
		{ id: 12, title: CATEGORIES.INCOME.GIFT, icon: <GiftIcon /> },
		{ id: 13, title: CATEGORIES.INCOME.SALARY, icon: <SalaryIcon /> },
		{ id: 14, title: CATEGORIES.INCOME.STOCKS, icon: <StockIcon /> },
		{ id: 15, title: CATEGORIES.INCOME.ADVANCE, icon: <AdvanceIcon /> },
		{ id: 16, title: CATEGORIES.INCOME.FREELANCE, icon: <FreelanceIcon /> },
		{ id: 17, title: CATEGORIES.INCOME.CASHBACK, icon: <CashbackIcon /> },
		{ id: 18, title: CATEGORIES.INCOME.OTHER, icon: <OtherIcon /> }
	]
}

const formatDate = (date: string): string => {
	const dayjsDate = dayjs(date)
	const day = dayjsDate.date()
	const month = dayjsDate.month() + 1
	const year = dayjsDate.year()
	const monthName = dayjsDate.localeData().monthsShort(dayjsDate)

	return `${day} ${monthName} ${year}`
}
export default function AddScreen() {
	const [selectedLanguage, setSelectedLanguage] = useState<
		ECatogories.EXPENSES | ECatogories.INCOME
	>(ECatogories.EXPENSES)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [selectedDate, setSelectedDate] = useState<string>(
		INITIAL_DATE.toISOString()
	)
	const [amount, setAmount] = useState('')
	const addTransaction = useTransactionStore(state => state.addTransaction)

	const bottomSheetRef = useRef<BottomSheetModal>(null)

	const selectCategory = (categoryId: any) => {
		setSelectedCategory(categoryId)
	}
	const handleBack = () => {
		router.back()
	}

	const handleDismiss = () => {
		bottomSheetRef.current?.dismiss()
	}

	const handlePresent = () => {
		bottomSheetRef.current?.present()
	}

	const handleDateChange = (date: string) => {
		setSelectedDate(date)
	}

	const handleAmountChange = (text: string) => {
		const sanitizedText = text.replace(/[^0-9.]/g, '')

		const hasDot = sanitizedText.includes('.')

		const [wholePart, decimalPart] = sanitizedText.split('.')

		let formattedText = sanitizedText

		if (hasDot) {
			formattedText = `${wholePart}.${decimalPart?.slice(0, 2) || ''}`
		}

		if (wholePart.length > 1 && wholePart[0] === '0') {
			formattedText =
				wholePart.slice(1) +
				(hasDot ? `.${decimalPart?.slice(0, 2) || ''}` : '')
		}

		const numValue = parseFloat(formattedText)
		if (numValue > 999999999) {
			Alert.alert('Ошибка', 'Слишком большая сумма')
			return
		}

		setAmount(formattedText)
	}

	const validateAmount = () => {
		if (amount.trim() === '') {
			Alert.alert('Ошибка', 'Пожалуйста, введите сумму')
			return false
		}

		const numAmount = Number(amount)

		if (isNaN(numAmount)) {
			Alert.alert('Ошибка', 'Пожалуйста, введите корректное число')
			return false
		}

		if (numAmount <= 0) {
			Alert.alert('Ошибка', 'Сумма должна быть больше нуля')
			return false
		}

		if (amount.includes('.') && amount.split('.')[1].length > 2) {
			Alert.alert('Ошибка', 'Максимум два знака после запятой')
			return false
		}

		return true
	}

	const handleSave = async () => {
		if (!validateAmount()) return
		if (!selectedCategory) {
			Alert.alert('Ошибка', 'Пожалуйста, выберите категорию')
			return
		}

		try {
			const category = categories[selectedLanguage].find(
				c => c.id === selectedCategory
			)
			const transaction = {
				category: category?.title || 'Другое',
				price: Number(amount),
				color: getCategoryColor(category?.title || 'Другое'),
				type: selectedLanguage === ECatogories.INCOME ? 'income' : 'expense',
				date: new Date(selectedDate),
				description: ''
			}

			addTransaction(transaction)
			console.log('Transaction saved successfully')
			router.push('(tabs)')
		} catch (error) {
			console.error('Error saving transaction:', error)
			Alert.alert('Ошибка', 'Не удалось сохранить транзакцию')
		}
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView>
				<BackButton handleBack={handleBack} />
				<View style={styles.mainTextContainer}>
					<TouchableOpacity
						onPress={() => setSelectedLanguage(ECatogories.EXPENSES)}
					>
						<View
							style={[
								selectedLanguage === 'expenses'
									? { borderBottomColor: Colors.blue, borderBottomWidth: 1 }
									: {}
							]}
						>
							<Text
								style={[
									selectedLanguage === 'expenses'
										? { fontSize: 20, color: Colors.blue, fontWeight: '700' }
										: { fontSize: 20, color: Colors.grey_2, fontWeight: '700' }
								]}
							>
								Расход
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setSelectedLanguage(ECatogories.INCOME)}
					>
						<View
							style={[
								selectedLanguage === 'income'
									? { borderBottomColor: Colors.blue, borderBottomWidth: 1 }
									: {}
							]}
						>
							<Text
								style={[
									selectedLanguage === 'income'
										? { fontSize: 20, color: Colors.blue, fontWeight: 'bold' }
										: { fontSize: 20, color: Colors.grey_2, fontWeight: 'bold' }
								]}
							>
								Доход
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.contentToDisplay}>
					<View>
						<Text style={styles.subText}>Сумма</Text>

						<CommonInput
							placeholder='1000'
							value={amount}
							onChangeText={handleAmountChange}
							keyboardType='numeric'
						/>
					</View>
					<View>
						<Text style={styles.subText}>Категория</Text>
						<View
							style={{
								flexDirection: 'row',
								flexWrap: 'wrap',
								gap: 23
							}}
						>
							{categories[selectedLanguage].map(category => (
								<CategoryButton
									key={category.id}
									id={category.id}
									title={category.title}
									handleCategory={selectCategory}
									selectedCategory={selectedCategory}
									icon={category.icon}
								/>
							))}
						</View>
					</View>
					<View>
						<Text style={styles.subText}>Дата</Text>
						<View style={styles.dateRow}>
							<View style={{ flex: 1 }}>
								<CommonInput placeholder={formatDate(selectedDate)} />
							</View>
							<View style={{ marginLeft: 34 }}>
								<CalendarPickButton handlePresent={handlePresent} />
							</View>
						</View>
					</View>
					<View>
						<CommonButton placeholder='Сохранить' onPress={handleSave} />
					</View>
				</View>

				<CalendarPickModal
					handleDateChange={handleDateChange}
					selectedDate={selectedDate}
					handleDismiss={handleDismiss}
					ref={bottomSheetRef}
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	subText: {
		color: Colors.black,
		fontSize: 17,
		fontWeight: '500',
		marginBottom: 12
	},
	mainTextContainer: {
		flexDirection: 'row',
		gap: 126,
		justifyContent: 'center',
		marginTop: 24
	},
	contentToDisplay: {
		marginHorizontal: 32,
		marginTop: 32,
		marginBottom: 34,
		gap: 24
	},
	dateRow: {
		width: '100%',
		flexDirection: 'row'
	}
})
