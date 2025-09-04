import React, { useRef } from 'react'
import {
	TouchableOpacity,
	Alert,
	ScrollView
} from 'react-native'
import ThemedView from '@/components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ThemedText from '@/components/ThemedText'
import BackButton from '@/components/BackButton'
import { useTransactionStore } from '@/store/transactionStore'
import { useFinanceStore } from '@/store/financeStore'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CurrencyPickModal from '@/components/CurrencyPickModal'
import { useSettingsStore } from '@/store/settingsStore'
import BufferSettingsModal from '@/components/BufferSettingsModal'
import { Logo } from '@/assets/images'
import ThemeSettingsModal from '@/components/ThemeSettingsModal'
import { useDynamicStyles } from '@/hooks'

export default function ProfileScreen() {
	const { clearTransactions } = useTransactionStore()
	const { setMonthlyBudget } = useFinanceStore()

	const { currency, safetyBufferPercent } = useSettingsStore()
	const currencyModalRef = useRef<BottomSheetModal>(null)
	const bufferModalRef = useRef<BottomSheetModal>(null)
	const themeModalRef = useRef<BottomSheetModal>(null)

	const styles = useDynamicStyles((colors) => ({
		container: {
			flex: 1,
		},
		safeArea: {
			flex: 1,
		},
		mainContent: {
			flex: 1,
			display: 'flex' as const,
			flexDirection: 'column' as const
		},
		scrollContent: {
			flex: 1,
			padding: 16
		},
		avatarSection: {
			alignItems: 'center' as const,
			marginBottom: 24
		},
		settingsCard: {
			backgroundColor: colors.card,
			borderRadius: 12,
			padding: 16,
			marginBottom: 16
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: '600' as const,
			marginBottom: 16,
			color: colors.textPrimary
		},
		settingItem: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: colors.border
		},
		settingValue: {
			color: colors.textSecondary
		},
		dangerZone: {
			padding: 16,
			paddingBottom: 32
		},
		resetButton: {
			backgroundColor: colors.error,
			padding: 16,
			borderRadius: 12,
			alignItems: 'center' as const
		},
		resetButtonText: {
			color: colors.onPrimary,
			fontSize: 16,
			fontWeight: '600' as const
		},
		lastItem: {
			borderBottomWidth: 0
		}
	}))

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

	const handleTransactionHistory = () => {
		router.push('/transaction-history')
	}

	const handleThemePress = () => {
		themeModalRef.current?.present()
	}

	const handleThemeDismiss = () => {
		themeModalRef.current?.dismiss()
	}

	return (
		<ThemedView colorName="background" style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<BackButton handleBack={handleBack} />

				<ThemedView colorName="background" style={styles.mainContent}>
					<ScrollView style={styles.scrollContent}>
						<ThemedText type="heading">Профиль</ThemedText>

						{/* Аватар и основная информация */}
						<ThemedView colorName="background" style={styles.avatarSection}>
							<Logo />
							<ThemedText type="subtitle">Пользователь</ThemedText>
						</ThemedView>

						{/* Настройки */}
						<ThemedView colorName="card" style={styles.settingsCard}>
							<ThemedText type="primary" style={styles.sectionTitle}>Настройки</ThemedText>
							
							<TouchableOpacity style={styles.settingItem} onPress={handleThemePress}>
								<ThemedText>Тема приложения</ThemedText>
								<ThemedText type="secondary" style={styles.settingValue}>›</ThemedText>
							</TouchableOpacity>

							<TouchableOpacity style={styles.settingItem} onPress={handleCurrencyPress}>
								<ThemedText>Валюта</ThemedText>
								<ThemedText type="secondary" style={styles.settingValue}>{currency.symbol} {currency.code} ›</ThemedText>
							</TouchableOpacity>

							<TouchableOpacity style={[styles.settingItem, styles.lastItem]} onPress={handleBufferPress}>
								<ThemedText>Буферный процент</ThemedText>
								<ThemedText type="secondary" style={styles.settingValue}>{safetyBufferPercent}% ›</ThemedText>
							</TouchableOpacity>
						</ThemedView>

						{/* История транзакций */}
						<ThemedView colorName="card" style={styles.settingsCard}>
							<TouchableOpacity style={[styles.settingItem, styles.lastItem]} onPress={handleTransactionHistory}>
								<ThemedText>История транзакций</ThemedText>
								<ThemedText type="secondary" style={styles.settingValue}>›</ThemedText>
							</TouchableOpacity>
						</ThemedView>

						{/* Опасная зона */}
						<ThemedView colorName="background" style={styles.dangerZone}>
							<TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
								<ThemedText style={styles.resetButtonText}>Сбросить все данные</ThemedText>
							</TouchableOpacity>
						</ThemedView>
					</ScrollView>

					<CurrencyPickModal
						ref={currencyModalRef}
						handleDismiss={handleCurrencyDismiss}
					/>

					<BufferSettingsModal
						ref={bufferModalRef}
						handleDismiss={handleBufferDismiss}
					/>

					<ThemeSettingsModal
						ref={themeModalRef}
						handleDismiss={handleThemeDismiss}
					/>
				</ThemedView>
			</SafeAreaView>
		</ThemedView>
	)
}