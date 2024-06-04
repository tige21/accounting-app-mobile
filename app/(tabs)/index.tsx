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

export default function AddScreen() {
	const [selectedLanguage, setSelectedLanguage] = useState<string>('expenses')
	const [selectedCategory, setSelectedCategory] = useState(null)
	const categories = [
		{ id: 0, name: 'Здоровье' },
		{ id: 1, name: 'Транспорт' },
		{ id: 2, name: 'Животные' },
		{ id: 3, name: 'Красота' },
		{ id: 4, name: 'Образование' },
		{ id: 5, name: 'Переводы' },
		{ id: 6, name: 'Кафе' },
		{ id: 7, name: 'Равзлечения' },
		{ id: 8, name: 'Другое' },
		{ id: 9, name: 'Продукты' },
		{ id: 10, name: 'Дом' },
		{ id: 11, name: 'Пассвиный' },
		{ id: 12, name: 'Подарок' },
		{ id: 13, name: 'Зарплата' },
		{ id: 14, name: 'Акции' },
		{ id: 15, name: 'Аванс' },
		{ id: 16, name: 'Фриланс' },
		{ id: 17, name: 'Кешбэк' },
		{ id: 18, name: 'Другое' }
	]

	const selectCategory = categoryId => {
		setSelectedCategory(categoryId)
	}

	const bottomSheetRef = useRef<BottomSheetModal>(null)
	let contentToDisplay = null

	if (selectedLanguage === 'expenses') {
		contentToDisplay = (
			<View style={styles.contentToDisplay}>
				<View>
					<Text style={styles.subText}>Сумма</Text>
					<View>
						<View style={styles.inputView}>
							<TextInput
								style={styles.inputText}
								placeholder='1000'
								placeholderTextColor={Colors.grey_1}
							/>
						</View>
					</View>
				</View>
				<View>
					<Text style={styles.subText}>Категория</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginHorizontal: -5
						}}
					>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[0].id)}
							>
								<View style={styles.iconView}>
									<HealthIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[0].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[0].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[1].id)}
							>
								<View style={styles.iconView}>
									<TransportIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[1].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[1].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[2].id)}
							>
								<View style={styles.iconView}>
									<PetsIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[2].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[2].name}
								</Text>
							</TouchableOpacity>
						</View>

						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[3].id)}
							>
								<View style={styles.iconView}>
									<BeautyIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[3].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[3].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[4].id)}
							>
								<View style={styles.iconView}>
									<EducationIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[4].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[4].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[5].id)}
							>
								<View style={styles.iconView}>
									<TransactionsIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[5].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[5].name}
								</Text>
							</TouchableOpacity>
						</View>

						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[6].id)}
							>
								<View style={styles.iconView}>
									<RestaurantsIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[6].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[6].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[7].id)}
							>
								<View style={styles.iconView}>
									<EntertainmentIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[7].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[7].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[8].id)}
							>
								<View style={styles.iconView}>
									<OtherIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[8].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[8].name}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[9].id)}
							>
								<View style={styles.iconView}>
									<GroceriesIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[9].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[9].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[10].id)}
							>
								<View style={styles.iconView}>
									<HouseIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[10].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[10].name}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		)
	} else if (selectedLanguage === 'income') {
		contentToDisplay = (
			<View style={styles.contentToDisplay}>
				<View>
					<Text style={styles.subText}>Сумма</Text>
					<View>
						<View style={styles.inputView}>
							<TextInput
								style={styles.inputText}
								placeholder='1000'
								placeholderTextColor={Colors.grey_1}
							/>
						</View>
					</View>
				</View>
				<View>
					<Text style={styles.subText}>Категория</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginHorizontal: -5
						}}
					>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[11].id)}
							>
								<View style={styles.iconView}>
									<PassiveIncomeIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[11].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[11].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[12].id)}
							>
								<View style={styles.iconView}>
									<GiftIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[12].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[12].name}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[13].id)}
							>
								<View style={styles.iconView}>
									<SalaryIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[13].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[13].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[14].id)}
							>
								<View style={styles.iconView}>
									<StockIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[14].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[14].name}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[15].id)}
							>
								<View style={styles.iconView}>
									<AdvanceIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[15].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[15].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[16].id)}
							>
								<View style={styles.iconView}>
									<FreelanceIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[16].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[16].name}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[17].id)}
							>
								<View style={styles.iconView}>
									<CashbackIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[17].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[17].name}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.iconCategoryView]}
								onPress={() => selectCategory(categories[18].id)}
							>
								<View style={styles.iconView}>
									<OtherIcon />
								</View>
								<Text
									style={
										selectedCategory === categories[18].id
											? styles.selectedText
											: styles.placeholderCategory
									}
								>
									{categories[18].name}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView>
				<View style={styles.iconBack}>
					<Ionicons name='chevron-back' size={24} color={Colors.grey_2} />
				</View>
				<View style={styles.mainTextContainer}>
					<TouchableOpacity onPress={() => setSelectedLanguage('expenses')}>
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
					<TouchableOpacity onPress={() => setSelectedLanguage('income')}>
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
				{contentToDisplay}
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	iconBack: {
		marginLeft: 20,
		marginTop: 10
	},
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
	inputView: {
		width: '100%',
		backgroundColor: 'white',
		height: 44,
		justifyContent: 'center',
		borderRadius: 10
	},
	inputText: {
		color: Colors.black,
		fontSize: 17,
		marginLeft: 12
	},
	iconView: {
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		height: 60,
		width: 60,
		borderRadius: 10
	},
	iconCategoryView: {
		width: 70,
		alignItems: 'center',
		gap: 2
	},
	placeholderCategory: {
		fontSize: 10,
		color: Colors.grey_2
	},
	contentToDisplay: {
		marginHorizontal: 32,
		marginTop: 32,
		gap: 24
	},
	selectedText: {
		fontSize: 10,
		color: Colors.blue
	}
})

