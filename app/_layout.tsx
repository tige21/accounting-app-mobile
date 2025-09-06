import '../global.css'

if (__DEV__) {
	require('../ReactotronConfig')
}
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts } from 'expo-font'
import * as Localization from 'expo-localization'
import { SplashScreen, Stack, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import uuid from 'react-native-uuid'
import '../constants/i18n/i18n.config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initTaskCleaning, cleanupTaskCleaning } from '@/store/taskStore'
import AnimateSplashScreen from '@/components/AnimateSplashScreen'
import NotificationsProvider from '@/components/NotificationsProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'

SplashScreen.hideAsync()

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font
	})
	const [appReady, setAppReady] = useState(false)
	const [splashAnimationFinished, setSplashAnimationFinished] = useState(false)
	const router = useRouter()
	let [locale, setLocale] = useState<string>(
		Localization.getLocales()[0].languageCode || 'ru'
	)

	const queryClient = new QueryClient()

	useEffect(() => {
		if (error) throw error
	}, [error])

	const saveLanguage = async () => {
		const deviceLanguage = locale
		try {
			await AsyncStorage.setItem('language', deviceLanguage)
		} catch (e) {
			console.error('Ошибка при сохранении языка в AsyncStorage:', e)
		}
	}

	const generateAndSaveUUID = async () => {
		try {
			const id = uuid.v4()
			await AsyncStorage.setItem('user_id', id.toString())
			// await saveLanguage(); // Сохранение языка устройства
			console.log('UUID успешно сохранен:', id)
		} catch (error) {
			console.error('Ошибка при сохранении UUID в AsyncStorage:', error)
		}
	}

	const getData = async () => {
		try {
			const user = await AsyncStorage.getItem('user_id')
			if (!user) {
				await generateAndSaveUUID() // Генерация и сохранение UUID и языка, если пользователь не найден
			} else {
				console.log('UUID успешно получен:', user)
			}
		} catch (e) {
			console.error('Ошибка чтения из AsyncStorage:', e)
		}
	}

	useEffect(() => {
		if (loaded || error) {
			const user = getData()
			console.log(user)
			if (!user) {
				generateAndSaveUUID()
			}

			setAppReady(true)
			initTaskCleaning()
		}

		// Cleanup function to remove listeners when component unmounts
		return () => {
			cleanupTaskCleaning()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	const showAnimatedSplash = !appReady || !splashAnimationFinished

	if (showAnimatedSplash) {
		return (
			<AnimateSplashScreen
				onAnimationFinish={isCancelled => {
					if (!isCancelled) {
						setSplashAnimationFinished(true)
					}
				}}
			/>
		)
	}

	return (
		<ThemeProvider>
			<NotificationsProvider>
				<QueryClientProvider client={queryClient}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<BottomSheetModalProvider>
							<Stack>
								<Stack.Screen
									name='(tabs)'
									options={{ headerShown: false }}
								/>
								
								<Stack.Screen
									name='task-details'
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name='edit-task'
									options={{ headerShown: false }}
								/>
								<Stack.Screen name='profile' options={{ headerShown: false }} />
								<Stack.Screen
									name='note-details'
									options={{ headerShown: false }}
								/>
							</Stack>
						</BottomSheetModalProvider>
					</GestureHandlerRootView>
				</QueryClientProvider>
			</NotificationsProvider>
		</ThemeProvider>
	)
}
