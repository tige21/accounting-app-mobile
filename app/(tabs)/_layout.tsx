import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, useColorScheme, View } from 'react-native'


import { ThemeColors } from '@/constants/Colors'
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons'
import styles from '../styles'
import { HapticTab } from '@/components/HapticTab'
import TabBarBackground from '@/components/TabbarBackground/TabBarBackground'

export default function TabLayout() {
	const colorScheme = useColorScheme()

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: ThemeColors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute'
					},
					default: {}
				})
			}}
		>
			<Tabs.Screen
				name='task-screen'
				options={{
					tabBarIcon: ({ color }) => (
						<View style={styles.iconContainer}>
							<MaterialIcons name='task-alt' size={28} color={color} />
						</View>
					),
					tabBarLabel: ''
				}}
			/>
            <Tabs.Screen
				name='eisenhower-matrix'
				options={{
					tabBarIcon: ({ color }) => (
						<View style={styles.iconContainer}>
							<MaterialIcons name='task-alt' size={28} color={color} />
						</View>
					),
					tabBarLabel: ''
				}}
			/>

		</Tabs>
	)
}
