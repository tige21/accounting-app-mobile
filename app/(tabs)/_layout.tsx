import Colors from '@/constants/Colors'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router, Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import Animated, { 
	useAnimatedStyle, 
	withSpring, 
	useSharedValue,
	withSequence,
	withTiming 
} from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function TabLayout() {
	const scale = useSharedValue(1)

	const handlePressIn = () => {
		scale.value = withSpring(0.9)
	}

	const handlePressOut = () => {
		scale.value = withSpring(1)
	}

	const handlePress = () => {
		// Анимация нажатия
		scale.value = withSequence(
			withTiming(0.9, { duration: 100 }),
			withTiming(1.1, { duration: 100 }),
			withTiming(1, { duration: 100 })
		)
		router.push("/transaction")
	}

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }]
	}))

	return (
		<View style={styles.container}>
			<Tabs
				initialRouteName={'bar-screen'}
				screenOptions={{
					tabBarActiveTintColor: Colors.blue,
					tabBarInactiveTintColor: Colors.grey_2,
					headerShown: false,
					tabBarStyle: styles.tabBar
				}}
			>
				<Tabs.Screen
					name='analytics-screen'
					options={{
						tabBarIcon: ({ color }) => (
							<View style={styles.iconContainer}>
								<Ionicons name='analytics' size={32} color={color} />
							</View>
						),
						tabBarLabel: 'Аналитика'
					}}
				/>
				<Tabs.Screen
					name='task-screen'
					options={{
						tabBarIcon: ({ color }) => (
							<View style={styles.iconContainer}>
								<MaterialIcons name='task-alt' size={32} color={color} />
							</View>
						),
						tabBarLabel: 'Задачи'
					}}
				/>
				<Tabs.Screen
					name='index'
					options={{
						tabBarButton: () => (
							<AnimatedPressable
								style={[styles.plusButton, animatedStyle]}
								onPressIn={handlePressIn}
								onPressOut={handlePressOut}
								onPress={handlePress}
							>
								<Feather name="plus" size={32} color={Colors.blue} />
							</AnimatedPressable>
						),
						tabBarLabel: '',
						headerShown: false
					}}
				/>
				<Tabs.Screen
					name='pie-screen'
					options={{
						tabBarIcon: ({ color }) => (
							<View style={styles.iconContainer}>
								<MaterialIcons name='donut-large' size={32} color={color} />
							</View>
						),
						tabBarLabel: 'Расходы'
					}}
				/>
				<Tabs.Screen
					name='bar-screen'
					options={{
						tabBarIcon: ({ color }) => (
							<View style={styles.iconContainer}>
								<MaterialIcons name='bar-chart' size={32} color={color} />
							</View>
						),
						tabBarLabel: 'Статистика'
					}}
				/>
			</Tabs>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	iconContainer: {
		width: 50,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tabBar: {
		height: 80,
		paddingBottom: 20,
	},
	plusButton: {
		width: 60,
		height: 60,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: -30, // Поднимаем кнопку выше
		backgroundColor: 'white',
		borderRadius: 30,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	}
})
