import React, { useRef } from 'react'
import { TouchableOpacity, Alert, ScrollView, View } from 'react-native'
import ThemedView from '@/components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ThemedText from '@/components/ThemedText'
import BackButton from '@/components/BackButton'
import { useTransactionStore } from '@/store/transactionStore'
import { useFinanceStore } from '@/store/financeStore'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useSettingsStore, ThemeMode } from '@/store/settingsStore'
import { Logo } from '@/assets/images'
import ThemeSettingsModal from '@/components/ThemeSettingsModal'
import { useDynamicStyles, useThemeColorValue } from '@/hooks'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileScreen() {
	const { clearTransactions } = useTransactionStore()
	const { setMonthlyBudget } = useFinanceStore()
	const { themeMode, setThemeMode } = useSettingsStore()
	const themeModalRef = useRef<BottomSheetModal>(null)
	const primaryColor = useThemeColorValue('primary')

	const styles = useDynamicStyles(colors => ({
		container: {
			flex: 1
		},
		safeArea: {
			flex: 1
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
			paddingVertical: 12
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
		},
		themeOptionsContainer: {
			flexDirection: 'row' as const,
			gap: 8,
			marginTop: 12
		},
		themeOption: {
			flex: 1,
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			paddingVertical: 12,
			paddingHorizontal: 12,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			gap: 6
		},
		activeThemeOption: {
			borderColor: colors.primary,
			backgroundColor: colors.primary + '15'
		},
		themeOptionText: {
			fontSize: 12,
			color: colors.textSecondary,
			textAlign: 'center' as const
		},
		activeThemeOptionText: {
			color: colors.primary,
			fontWeight: '600' as const
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

	const handleThemePress = () => {
		themeModalRef.current?.present()
	}

	const handleThemeDismiss = () => {
		themeModalRef.current?.dismiss()
	}

	const getThemeLabel = (mode: ThemeMode): string => {
		switch (mode) {
			case 'light':
				return 'Светлая'
			case 'dark':
				return 'Темная'
			case 'system':
				return 'Системная'
			default:
				return 'Системная'
		}
	}

	const getThemeIcon = (mode: ThemeMode): keyof typeof Ionicons.glyphMap => {
		switch (mode) {
			case 'light':
				return 'sunny-outline'
			case 'dark':
				return 'moon-outline'
			case 'system':
				return 'phone-portrait-outline'
			default:
				return 'phone-portrait-outline'
		}
	}

	const themeOptions: ThemeMode[] = ['light', 'dark', 'system']

	return (
		<ThemedView colorName='background' style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<BackButton handleBack={handleBack} />

				<ThemedView colorName='background' style={styles.mainContent}>
					<ScrollView style={styles.scrollContent}>
						<ThemedText type='heading'>Профиль</ThemedText>

						{/* Аватар и основная информация */}
						<ThemedView colorName='background' style={styles.avatarSection}>
							<Logo />
							<ThemedText type='subtitle'>Пользователь</ThemedText>
						</ThemedView>

						{/* Настройки */}
						<ThemedView colorName='card' style={styles.settingsCard}>
							<ThemedText type='primary' style={styles.sectionTitle}>
								Настройки
							</ThemedText>

							{/* Прямое переключение тем */}
							<View style={styles.themeOptionsContainer}>
								{themeOptions.map((option) => (
									<TouchableOpacity
										key={option}
										style={[
											styles.themeOption,
											themeMode === option && styles.activeThemeOption
										]}
										onPress={() => setThemeMode(option)}
									>
										<Ionicons 
											name={getThemeIcon(option)}
											size={16}
											color={themeMode === option ? primaryColor : styles.themeOptionText.color}
										/>
										<ThemedText 
											style={[
												styles.themeOptionText,
												themeMode === option && styles.activeThemeOptionText
											]}
										>
											{getThemeLabel(option)}
										</ThemedText>
									</TouchableOpacity>
								))}
							</View>
						</ThemedView>

						{/* Опасная зона */}
						<ThemedView colorName='background' style={styles.dangerZone}>
							<TouchableOpacity
								style={styles.resetButton}
								onPress={handleResetData}
							>
								<ThemedText style={styles.resetButtonText}>
									Сбросить все данные
								</ThemedText>
							</TouchableOpacity>
						</ThemedView>
					</ScrollView>
				</ThemedView>
			</SafeAreaView>
		</ThemedView>
	)
}
