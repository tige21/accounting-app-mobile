import CustomBottomSheetModal from '@/components/CalendarPickModal'
import Colors from '@/constants/Colors'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useRef, useState } from 'react'
import {
	KeyboardAvoidingView,
	Text,
	View,
	StyleSheet,
	Alert,
	TextInput
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

dayjs.locale('ru')
dayjs.extend(localeData)

const INITIAL_DATE = new Date()

const categories = {
	[ECatogories.EXPENSES]: [
		{ id: 19, title: CATEGORIES.EXPENSES.HEALTH, icon: <HealthIcon /> },
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
		padding: 16,
		gap: 24
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
		flexWrap: 'wrap',
		gap: 23
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

	const renderScene = ({route}: {route: {key: string}}) => {
		switch (route.key) {
			case 'expenses':
				return <TransactionForm type='expenses' selectedDate={selectedDate} handlePresent={handlePresent} />
			case 'income':
				return <TransactionForm type='income' selectedDate={selectedDate} handlePresent={handlePresent} />
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
            <KeyboardAvoidingView style={{ flex: 1 }}>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<BackButton handleBack={() => router.back()} />

			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				renderTabBar={renderTabBar}
				style={{ flex: 1 }}
			/>

			<CalendarPickModal
				ref={bottomSheetRef}
				handleDateChange={handleDateChange}
				selectedDate={selectedDate}
				handleDismiss={handleDismiss}
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
	const [selectedCategory, setSelectedCategory] = useState(null)
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
			router.push('(tabs)')
		} catch (error) {
			console.error('Error saving transaction:', error)
			Alert.alert('Ошибка', 'Не удалось сохранить транзакцию')
		}
	}

	return (
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
				<View style={styles.categoriesContainer}>
					{categories[
						type === 'expenses' ? ECatogories.EXPENSES : ECatogories.INCOME
					].map(category => (
						<CategoryButton
							key={category.id}
							id={category.id}
							title={category.title}
							handleCategory={handleCategoryChange}
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
			<View>
				<CommonButton placeholder='Сохранить' onPress={handleSave} />
			</View>
		</View>
	)
}
