import SvgComponent from '@/assets/images/svg/add'
import Colors from '@/constants/Colors'
import {
	MaterialCommunityIcons,
	MaterialIcons,
} from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function TabLayout() {
	return (
		<Tabs
			initialRouteName='index'
			screenOptions={{
				tabBarActiveTintColor: Colors.violet,
				tabBarShowLabel: false,
				tabBarStyle: { height: 100 }
			}}
		>
			<Tabs.Screen
				name='two'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<View style={styles.iconContainer}>
							<MaterialCommunityIcons
								name='chart-donut'
								size={40}
								color={Colors.grey}
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
						<View style={styles.plusIconContainer}>
							<SvgComponent />
						</View>
					)
				}}
			/>
			<Tabs.Screen
				name='three'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<View style={styles.iconContainer}>
							<MaterialIcons name='bar-chart' size={50} color={Colors.grey} />
						</View>
					)
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
		bottom: 33, 
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%'
	}
})
