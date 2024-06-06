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
import TransactionsIcon from '@/assets/svg/transactions-icon '
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
import { CalendarPickModal, CommonInput } from '@/components'
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton'
import BackButton from '@/components/BackButton'


export default function AddScreen() {
	const [selectedLanguage, setSelectedLanguage] = useState<
		ECatogories.EXPENSES | ECatogories.INCOME
	>(ECatogories.EXPENSES)
	const [selectedCategory, setSelectedCategory] = useState(null)

	const bottomSheetRef = useRef<BottomSheetModal>(null)

	const categories = {
		[ECatogories.EXPENSES]: [
			{ id: 0, title: 'Здоровье', icon: <HealthIcon /> },
			{ id: 1, title: 'Транспорт', icon: <TransportIcon /> },
			{ id: 2, title: 'Животные', icon: <PetsIcon /> },
			{ id: 3, title: 'Красота', icon: <BeautyIcon /> },
			{ id: 4, title: 'Образование', icon: <EducationIcon /> },
			{ id: 5, title: 'Переводы', icon: <TransactionsIcon /> },
			{ id: 6, title: 'Кафе', icon: <RestaurantsIcon /> },
			{ id: 7, title: 'Равзлечения', icon: <EntertainmentIcon /> },
			{ id: 8, title: 'Другое', icon: <OtherIcon /> }
		],
		[ECatogories.INCOME]: [
			{ id: 9, title: 'Продукты', icon: <GroceriesIcon /> },
			{ id: 10, title: 'Дом', icon: <HouseIcon /> },
			{ id: 11, title: 'Пассвиный', icon: <PassiveIncomeIcon /> },
			{ id: 12, title: 'Подарок', icon: <GiftIcon /> },
			{ id: 13, title: 'Зарплата', icon: <SalaryIcon /> },
			{ id: 14, title: 'Акции', icon: <StockIcon /> },
			{ id: 15, title: 'Аванс', icon: <AdvanceIcon /> },
			{ id: 16, title: 'Фриланс', icon: <FreelanceIcon /> },
			{ id: 17, title: 'Кешбэк', icon: <CashbackIcon /> },
			{ id: 18, title: 'Другое', icon: <OtherIcon /> }
		]
	}

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

						<CommonInput placeholder='1000' />
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
								<CommonInput placeholder='16 мая 2024' />
							</View>
							<View style={{ marginLeft: 34 }}>
								<CalendarPickButton handlePresent={handlePresent} />
							</View>
						</View>
					</View>
				</View>
				<View>
					<CommonButton placeholder='Сохранить' />
				</View>
				<CalendarPickModal handleDismiss={handleDismiss} ref={bottomSheetRef} />
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
