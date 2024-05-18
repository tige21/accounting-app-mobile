import Colors from '@/constants/Colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
	return (
		<Tabs
			initialRouteName='two'
			screenOptions={{
				tabBarActiveTintColor: Colors.deepGray,
				tabBarShowLabel: false
			}}
		>
			<Tabs.Screen
				name='two'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<Ionicons name='heart' size={size} color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name='index'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<MaterialCommunityIcons name='cards' size={24} color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name='three'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<MaterialCommunityIcons
							name='account-box'
							size={24}
							color={color}
						/>
					)
				}}
			/>
		</Tabs>
	)
}
