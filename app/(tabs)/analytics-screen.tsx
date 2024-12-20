import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import Dropdown from '@/components/Dropdown'

export default function AnalyticsScreen() {
	const [selected, setSelected] = useState(null)

	const data = [
		{ key: '1', value: 'Блин' },
		{ key: '2', value: 'Блять' },
		{ key: '3', value: 'Я культурный' }
	]
	return (
		<SafeAreaView>
			<View>
				<Dropdown
					data={data}
					setSelected={setSelected}
					placeholder='Выбери'
				/>
			</View>
		</SafeAreaView>
	)
}
