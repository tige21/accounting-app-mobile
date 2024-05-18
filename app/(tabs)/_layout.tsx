import Colors from '@/constants/Colors'
import {
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	AntDesign
} from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
	return (
		<Tabs
			initialRouteName='index'
			screenOptions={{
				tabBarActiveTintColor: Colors.violet,
				tabBarShowLabel: false,
				tabBarStyle: { height: 78 }
			}}
		>
			<Tabs.Screen
				name='two'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<MaterialCommunityIcons
							name='chart-donut'
							size={40}
							color={Colors.grey}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name='index'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<AntDesign name='pluscircle' size={40} color={Colors.violet} />
					)
				}}
			/>
			<Tabs.Screen
				name='three'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<MaterialIcons name='bar-chart' size={50} color={Colors.grey} />
					)
				}}
			/>
		</Tabs>
	)
}
