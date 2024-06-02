import SvgComponent from '@/assets/images/svg/add'
import Colors from '@/constants/Colors'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import styles from '../styles'

export default function TabLayout() {
	return (
		<Tabs
			initialRouteName='index'
			screenOptions={{
				tabBarActiveTintColor: Colors.violet,
				tabBarShowLabel: false
			}}
		>
			<Tabs.Screen
				name='pie-screen'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<View style={styles.iconContainer}>
							<MaterialCommunityIcons
								name='chart-donut'
								size={40}
								color={color}
							/>
						</View>
					)
				}}
			/>
			<Tabs.Screen
				name='index'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<View style={styles.iconContainer}>
							<MaterialCommunityIcons
								name='chart-donut'
								size={40}
								color={color}
							/>
						</View>
					)
				}}
			/>
			<Tabs.Screen
				name='bar-screen'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<View style={styles.iconContainer}>
							<MaterialIcons name='bar-chart' size={50} color={color} />
						</View>
					)
				}}
			/>
		</Tabs>
	)
}

