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
	StyleSheet
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



export default function AddScreen() {
	const [selectedLanguage, setSelectedLanguage] = useState<string>('expenses')
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
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<HealthIcon />
								</View>
								<Text style={styles.placeholderCategory}>Здоровье</Text>
							</View>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<TransportIcon />
								</View>
								<Text style={styles.placeholderCategory}>Транспорт</Text>
							</View>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<PetsIcon />
								</View>
								<Text style={styles.placeholderCategory}>Животные</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<BeautyIcon />
								</View>
								<Text style={styles.placeholderCategory}>Красота</Text>
							</View>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<EducationIcon />
								</View>
								<Text style={styles.placeholderCategory}>Образование</Text>
							</View>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<TransactionsIcon />
								</View>
								<Text style={styles.placeholderCategory}>Переводы</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<RestaurantsIcon />
								</View>
								<Text style={styles.placeholderCategory}>Кафе</Text>
							</View>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<EntertainmentIcon />
								</View>
								<Text style={styles.placeholderCategory}>Развлечения</Text>
							</View>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<OtherIcon />
								</View>
								<Text style={styles.placeholderCategory}>Другое</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'column', gap: 12 }}>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<GroceriesIcon />
								</View>
								<Text style={styles.placeholderCategory}>Продукты</Text>
							</View>
							<View style={styles.iconCategoryView}>
								<View style={styles.iconView}>
									<HouseIcon />
								</View>
								<Text style={styles.placeholderCategory}>Дом</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		)
	} else if (selectedLanguage === 'income') {
		contentToDisplay = (
			<View
				style={{
					marginHorizontal: 32,
					marginTop: 32,
					gap: 24
				}}
			>
				<View>
					<Text style={styles.subText}>Сумма</Text>
					<View>
						<View style={styles.inputView}>
							<TextInput
								style={styles.inputText}
								placeholder='1000'
								placeholderTextColor={Colors.grey_2}
							/>
						</View>
					</View>
				</View>
				<View>
					<Text style={styles.subText}>Категория</Text>
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
										? { fontSize: 20, color: Colors.blue, fontWeight: 'bold' }
										: { fontSize: 20, color: Colors.grey_2, fontWeight: 'bold' }
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
	}
})


