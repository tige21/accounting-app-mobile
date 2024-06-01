import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated'
import styles from './styles'
interface SwitcherProps {
	onLanguageChange: (language: string) => void
	switcherStyle: any
}

const Switcher: React.FC<SwitcherProps> = ({
	onLanguageChange,
	switcherStyle
}) => {
	const [language, setLanguage] = useState<string>('en')

	// Получаем язык из AsyncStorage и устанавливаем его в состояние isEnglish
	const [isEnglish, setIsEnglish] = useState<boolean>(language === 'en')
	const translateX = useSharedValue(language === 'en' ? 24 : 0)

	useEffect(() => {
		const fetchLanguage = async () => {
			const storedLanguage = 'en'
			if (storedLanguage) {
				setIsEnglish(storedLanguage === 'en')
				translateX.value = withTiming(storedLanguage === 'en' ? 24 : 0, {
					duration: 300
				})
			}
		}
		fetchLanguage()
	}, [])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }]
		}
	})

	const toggleSwitch = async () => {
		const newLanguageValue = !isEnglish ? 'en' : 'ru'
		try {
			await AsyncStorage.setItem('language', newLanguageValue)
			setIsEnglish(!isEnglish)
			onLanguageChange(newLanguageValue)
			translateX.value = withTiming(isEnglish ? 0 : 24, { duration: 300 })
		} catch (e) {
			console.error('Ошибка при сохранении языка в AsyncStorage:', e)
		}
	}

	return (
		<View style={{ flexDirection: 'row', gap: 10 }}>
			<Animated.View style={[styles.container, switcherStyle]}>
				<TouchableOpacity onPress={toggleSwitch} style={styles.switcher}>
					<Animated.View style={[styles.knob, animatedStyle]} />
					<View style={styles.labels}></View>
				</TouchableOpacity>
			</Animated.View>
			<Text style={{ color: `#A9ABE4` }}>Тема</Text>
		</View>
	)
}

export default Switcher
