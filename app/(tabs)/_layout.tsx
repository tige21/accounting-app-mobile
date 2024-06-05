import SvgComponent from '@/assets/images/svg/add'
import Colors from '@/constants/Colors'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import {router, Tabs} from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function TabLayout() {
	return (
		<Tabs
			initialRouteName={'bar-screen'}
			screenOptions={{
				tabBarActiveTintColor: Colors.blue,
				tabBarInactiveTintColor: Colors.grey_2,
				headerShown: false,
				tabBarStyle: {
					paddingTop: 5
				}
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
					href: 'transaction',
					headerShown: false,
					tabBarIcon: ({}) => (
						<View style={styles.plusIconContainer}>
							<SvgComponent />
						</View>
					),
					tabBarLabel: ''
				}}
				listeners={() => ({
					tabPress: (e) => {
						e.preventDefault()
						router.push("transaction")
					},
				})}
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
	)
}

const styles = StyleSheet.create({
	iconContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	plusIconContainer: {
		position: 'absolute',
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center'
	}
})
