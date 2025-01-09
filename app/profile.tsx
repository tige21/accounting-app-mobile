import React, { useState, useRef } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Switch,
	Alert,
	ScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Colors from '@/constants/Colors'
import BackButton from '@/components/BackButton'
import { useTransactionStore } from '@/store/transactionStore'
import { useFinanceStore } from '@/store/financeStore'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CurrencyPickModal from '@/components/CurrencyPickModal'
import { useSettingsStore } from '@/store/settingsStore'
import BufferSettingsModal from '@/components/BufferSettingsModal'

export default function ProfileScreen() {
	const { clearTransactions } = useTransactionStore()
	const { setMonthlyBudget } = useFinanceStore()

	const [isDarkMode, setIsDarkMode] = useState(false)
	const [avatarUri, setAvatarUri] = useState<string | null>(null)
	const [notificationsEnabled, setNotificationsEnabled] = useState(true)
	const [biometricEnabled, setBiometricEnabled] = useState(false)

	const { currency, safetyBufferPercent } = useSettingsStore()
	const currencyModalRef = useRef<BottomSheetModal>(null)
	const bufferModalRef = useRef<BottomSheetModal>(null)

	const handleBack = () => {
		router.back()
	}

	const handleResetData = () => {
		Alert.alert(
			'Сброс данных',
			'Вы уверены, что хотите удалить все транзакции? Это действие нельзя отменить.',
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Сбросить',
					style: 'destructive',
					onPress: () => {
						clearTransactions()
						setMonthlyBudget(0)
					}
				}
			]
		)
	}

	const handleChangeAvatar = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		})

		if (!result.canceled) {
			setAvatarUri(result.assets[0].uri)
			await AsyncStorage.setItem('userAvatar', result.assets[0].uri)
		}
	}

	const toggleDarkMode = () => {
		setIsDarkMode(prev => !prev)
		// Здесь добавить логику изменения темы
	}

	const handleCurrencyPress = () => {
		currencyModalRef.current?.present()
	}

	const handleCurrencyDismiss = () => {
		currencyModalRef.current?.dismiss()
	}

	const handleBufferPress = () => {
		bufferModalRef.current?.present()
	}

	const handleBufferDismiss = () => {
		bufferModalRef.current?.dismiss()
	}

	return (
		<SafeAreaView style={styles.container}>
			<BackButton handleBack={handleBack} />

			<ScrollView style={styles.content}>
				<Text style={styles.title}>Профиль</Text>

				{/* Аватар и основная информация */}
				<View style={styles.avatarSection}>
					<TouchableOpacity onPress={handleChangeAvatar}>
						<Image
							source={
								avatarUri
									? { uri: avatarUri }
									: require('@/assets/images/logo.png')
							}
							style={styles.avatar}
						/>
					</TouchableOpacity>
					<Text style={styles.username}>Пользователь</Text>
				</View>

				{/* Финансовая сводка */}
				<View style={styles.statsCard}>
					<Text style={styles.sectionTitle}>Финансовая сводка</Text>

					<TouchableOpacity style={styles.statItem}>
						<Text>История операций</Text>
						<Text style={styles.arrowRight}>→</Text>
					</TouchableOpacity>
				</View>

				{/* Настройки */}
				<View style={styles.settingsCard}>
					<Text style={styles.sectionTitle}>Настройки</Text>

					{/* <View style={styles.settingItem}>
            <Text>Темная тема</Text>
            <Switch 
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: Colors.blue }}
            />
          </View> */}

					{/* <View style={styles.settingItem}>
            <Text>Уведомления</Text>
            <Switch 
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: Colors.blue }}
            />
          </View> */}

					{/* <View style={styles.settingItem}>
						<Text>Биометрическая защита</Text>
						<Switch
							value={biometricEnabled}
							onValueChange={setBiometricEnabled}
							trackColor={{ false: '#767577', true: Colors.blue }}
						/>
					</View> */}

					<TouchableOpacity 
						style={styles.settingItem}
						onPress={handleBufferPress}
					>
						<Text>Резервный буфер</Text>
						<Text style={styles.settingValue}>
							{safetyBufferPercent}% →
						</Text>
					</TouchableOpacity>

					<TouchableOpacity 
						style={styles.settingItem}
						onPress={handleCurrencyPress}
					>
						<Text>Валюта</Text>
						<Text style={styles.settingValue}>
							{currency.code} {currency.symbol} →
						</Text>
					</TouchableOpacity>

					{/* <TouchableOpacity style={styles.settingItem}>
            <Text>Категории расходов</Text>
            <Text style={styles.arrowRight}>→</Text>
          </TouchableOpacity> */}
				</View>

				{/* Опасная зона */}
				<View style={styles.dangerZone}>
					<TouchableOpacity
						style={styles.resetButton}
						onPress={handleResetData}
					>
						<Text style={styles.resetButtonText}>Сбросить все данные</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<CurrencyPickModal
				ref={currencyModalRef}
				handleDismiss={handleCurrencyDismiss}
			/>

			<BufferSettingsModal 
				ref={bufferModalRef}
				handleDismiss={handleBufferDismiss}
			/>
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
		padding: 16
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: Colors.black,
		marginBottom: 24
	},
	avatarSection: {
		alignItems: 'center',
		marginBottom: 24
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	editBadge: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		backgroundColor: Colors.blue,
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	editBadgeText: {
		color: 'white',
		fontSize: 16
	},
	username: {
		fontSize: 20,
		fontWeight: '600',
		marginTop: 12
	},
	statsCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	settingsCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16
	},
	settingItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0'
	},
	statItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0'
	},
	settingValue: {
		color: Colors.grey_2
	},
	arrowRight: {
		color: Colors.grey_2,
		fontSize: 18
	},
	dangerZone: {
		marginVertical:24
	},
	resetButton: {
		backgroundColor: '#FF3B30',
		padding: 16,
		borderRadius: 12,
		alignItems: 'center'
	},
	resetButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	}
})
