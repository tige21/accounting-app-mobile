import CustomBottomSheetModal from '@/components/CalendarPickModal'
import Colors from '@/constants/Colors'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useRef, useState } from 'react'
import {
	Text,
	View,
	StyleSheet,
	Alert,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
	ScrollView,
	KeyboardAvoidingView
} from 'react-native'
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
import CategoryButton from '@/components/CategoryButton'
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
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useWindowDimensions } from 'react-native'
import * as Haptics from 'expo-haptics'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

dayjs.locale('ru')
dayjs.extend(localeData)

const INITIAL_DATE = new Date()

const categories = {
	[ECatogories.EXPENSES]: [
		{
			id: 19,
			title: CATEGORIES.EXPENSES.HEALTH,
			icon: <HealthIcon color={getCategoryColor(CATEGORIES.EXPENSES.HEALTH)} />
		},
		{
			id: 1,
			title: CATEGORIES.EXPENSES.TRANSPORT,
			icon: (
				<TransportIcon
					color={getCategoryColor(CATEGORIES.EXPENSES.TRANSPORT)}
				/>
			)
		},
		{
			id: 2,
			title: CATEGORIES.EXPENSES.PETS,
			icon: <PetsIcon color={getCategoryColor(CATEGORIES.EXPENSES.PETS)} />
		},
		{
			id: 3,
			title: CATEGORIES.EXPENSES.BEAUTY,
			icon: <BeautyIcon color={getCategoryColor(CATEGORIES.EXPENSES.BEAUTY)} />
		},
		{
			id: 4,
			title: CATEGORIES.EXPENSES.EDUCATION,
			icon: (
				<EducationIcon
					color={getCategoryColor(CATEGORIES.EXPENSES.EDUCATION)}
				/>
			)
		},
		{
			id: 5,
			title: CATEGORIES.EXPENSES.TRANSFERS,
			icon: (
				<TransactionsIcon
					color={getCategoryColor(CATEGORIES.EXPENSES.TRANSFERS)}
				/>
			)
		},
		{
			id: 6,
			title: CATEGORIES.EXPENSES.CAFE,
			icon: (
				<RestaurantsIcon color={getCategoryColor(CATEGORIES.EXPENSES.CAFE)} />
			)
		},
		{
			id: 7,
			title: CATEGORIES.EXPENSES.ENTERTAINMENT,
			icon: (
				<EntertainmentIcon
					color={getCategoryColor(CATEGORIES.EXPENSES.ENTERTAINMENT)}
				/>
			)
		},
		{
			id: 8,
			title: CATEGORIES.EXPENSES.GROCERIES,
			icon: (
				<GroceriesIcon
					color={getCategoryColor(CATEGORIES.EXPENSES.GROCERIES)}
				/>
			)
		},
		{
			id: 9,
			title: CATEGORIES.EXPENSES.HOUSE,
			icon: <HouseIcon color={getCategoryColor(CATEGORIES.EXPENSES.HOUSE)} />
		},
		{
			id: 10,
			title: CATEGORIES.EXPENSES.OTHER,
			icon: <OtherIcon color={getCategoryColor(CATEGORIES.EXPENSES.OTHER)} />
		}
	],
	[ECatogories.INCOME]: [
		{
			id: 11,
			title: CATEGORIES.INCOME.PASSIVE,
			icon: (
				<PassiveIncomeIcon
					color={getCategoryColor(CATEGORIES.INCOME.PASSIVE)}
				/>
			)
		},
		{
			id: 12,
			title: CATEGORIES.INCOME.GIFT,
			icon: <GiftIcon color={getCategoryColor(CATEGORIES.INCOME.GIFT)} />
		},
		{
			id: 13,
			title: CATEGORIES.INCOME.SALARY,
			icon: <SalaryIcon color={getCategoryColor(CATEGORIES.INCOME.SALARY)} />
		},
		{
			id: 14,
			title: CATEGORIES.INCOME.STOCKS,
			icon: <StockIcon color={getCategoryColor(CATEGORIES.INCOME.STOCKS)} />
		},
		{
			id: 15,
			title: CATEGORIES.INCOME.ADVANCE,
			icon: <AdvanceIcon color={getCategoryColor(CATEGORIES.INCOME.ADVANCE)} />
		},
		{
			id: 16,
			title: CATEGORIES.INCOME.FREELANCE,
			icon: (
				<FreelanceIcon color={getCategoryColor(CATEGORIES.INCOME.FREELANCE)} />
			)
		},
		{
			id: 17,
			title: CATEGORIES.INCOME.CASHBACK,
			icon: (
				<CashbackIcon color={getCategoryColor(CATEGORIES.INCOME.CASHBACK)} />
			)
		},
		{
			id: 18,
			title: CATEGORIES.INCOME.OTHER,
			icon: <OtherIcon color={getCategoryColor(CATEGORIES.INCOME.OTHER)} />
		}
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
		flex: 1,
		padding: 20,
		gap: 24,
		height: '100%'
	},
	dateRow: {
		width: '100%',
		flexDirection: 'row'
	},
	tabBar: {
		backgroundColor: 'transparent',
		elevation: 0,
		marginHorizontal: 16
	},
	tabItem: {
		width: 'auto',
		padding: 0
	},
	tabText: {
		fontSize: 40,
		fontWeight: '700',
		color: Colors.blue
	},
	activeTab: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue
	},
	activeTabText: {
		color: Colors.blue
	},
	inactiveTabText: {
		color: Colors.grey_2
	},
	categoriesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	categoriesButton: {
		width: `${100 / 5}%`
	}
})

export default function AddScreen() {
	const layout = useWindowDimensions()
	const [index, setIndex] = useState(0)
	const [routes] = useState([
		{ key: 'expenses', title: 'Расход' },
		{ key: 'income', title: 'Доход' }
	])
	const [selectedDate, setSelectedDate] = useState<string>(
		INITIAL_DATE.toISOString()
	)
	const bottomSheetRef = useRef<BottomSheetModal>(null)

	// const selectCategory = (categoryId: any) => {
	// 	setSelectedCategory(categoryId)
	// }
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
		handleDismiss()
	}

	// const renderScene = SceneMap({
	// 	expenses: () => (
	// 		<TransactionForm
	// 			type='expenses'
	// 			selectedDate={selectedDate}
	// 			handlePresent={handlePresent}
	// 		/>
	// 	),
	// 	income: () => (
	// 		<TransactionForm
	// 			type='income'
	// 			selectedDate={selectedDate}
	// 			handlePresent={handlePresent}
	// 		/>
	// 	)
	// })

	const renderScene = ({ route }: { route: { key: string } }) => {
		switch (route.key) {
			case 'expenses':
				return (
					<TransactionForm
						type='expenses'
						selectedDate={selectedDate}
						handlePresent={handlePresent}
					/>
				)
			case 'income':
				return (
					<TransactionForm
						type='income'
						selectedDate={selectedDate}
						handlePresent={handlePresent}
					/>
				)
		}
	}

	const renderTabBar = (props: any) => (
		<TabBar
			{...props}
			style={styles.tabBar}
			indicatorStyle={{ backgroundColor: Colors.blue, color: Colors.blue }}
			activeColor={Colors.blue}
			inactiveColor={Colors.grey_2}
			pressColor='transparent'
			onTabPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
		/>
	)

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<BackButton handleBack={handleBack} />

			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				renderTabBar={renderTabBar}
				style={{ flex: 1 }}
			/>

			<CalendarPickModal
				handleDateChange={handleDateChange}
				selectedDate={selectedDate}
				handleDismiss={handleDismiss}
				ref={bottomSheetRef}
			/>
		</SafeAreaView>
	)
}

interface TransactionFormProps {
	type: 'expenses' | 'income'
	selectedDate: string
	handlePresent: () => void
}

export function TransactionForm({
	type,
	selectedDate,
	handlePresent
}: TransactionFormProps) {
	const [amount, setAmount] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
	const addTransaction = useTransactionStore(state => state.addTransaction)

	const handleCategoryChange = (categoryId: number) => {
		setSelectedCategory(categoryId)
	}

	const handleAmountChange = (text: string) => {
		if (isNaN(Number(text))) {
			Alert.alert('Ошибка', 'Пожалуйста, введите число')
			return
		}

		if (Number(text) > 999999999) {
			Alert.alert('Ошибка', 'Слишком большая сумма')
			return
		}

		setAmount(text)
	}

	const validateAmount = () => {
		if (amount.trim() === '') {
			Alert.alert('Ошибка', 'Пожалуйста, введите сумму')
			return false
		}

		const numAmount = Number(amount)
		if (numAmount <= 0) {
			Alert.alert('Ошибка', 'Сумма должна быть больше нуля')
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
			const category = categories[
				type === 'expenses' ? ECatogories.EXPENSES : ECatogories.INCOME
			].find(c => c.id === selectedCategory)

			const transaction = {
				category: category?.title || 'Другое',
				price: Number(amount),
				color: getCategoryColor(category?.title || 'Другое'),
				type: type === 'expenses' ? 'expense' : 'income',
				date: new Date(selectedDate),
				description: ''
			}

			addTransaction(transaction)
			router.push('/(tabs)')
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		} catch (error) {
			console.error('Error saving transaction:', error)
			Alert.alert('Ошибка', 'Не удалось сохранить транзакцию')
		}
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps='handled'
				>
					<View style={styles.contentToDisplay}>
						<View>
							<Text style={styles.subText}>Сумма</Text>
							<CommonInput
								placeholder='Введите сумму'
								value={amount}
								onChangeText={handleAmountChange}
								keyboardType='numeric'
							/>
						</View>

						<View style={{ flex: 1 }}>
							<Text style={styles.subText}>Категория</Text>
							<View style={[styles.categoriesContainer, { width: '100%' }]}>
								{categories[
									type === 'expenses'
										? ECatogories.EXPENSES
										: ECatogories.INCOME
								].map(category => (
									<View key={category.id} style={styles.categoriesButton}>
										<CategoryButton
											key={category.id}
											id={category.id}
											title={category.title}
											handleCategory={handleCategoryChange}
											selectedCategory={selectedCategory}
											icon={category.icon}
										/>
									</View>
								))}
							</View>
						</View>

						{/* Блок с датой */}
						<View>
							<Text style={styles.subText}>Дата</Text>
							<View style={styles.dateRow}>
								<View style={{ flex: 1 }}>
									<CommonInput
										editable={false}
										pointerEvents='none'
										placeholder={formatDate(selectedDate)}
									/>
								</View>
								<View style={{ marginLeft: 34 }}>
									<CalendarPickButton handlePresent={handlePresent} />
								</View>
							</View>
						</View>

						{/* Кнопка "Сохранить" */}
						<View>
							<CommonButton placeholder='Сохранить' onPress={handleSave} />
						</View>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}
