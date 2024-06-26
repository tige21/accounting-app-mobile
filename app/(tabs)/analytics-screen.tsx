import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import Dropdown from '@/components/Dropdown'



export default function AnalyticsScreen() {
    const [selected, setSelected] = useState(null)

		const data = [
			{ key: '1', value: 'Никогда' },
			{ key: '2', value: 'Ежедневно' },
			{ key: '3', value: 'Еженедельно' }
		]
	return (
		<SafeAreaView>
			<View>
				<Dropdown
					data={data}
					setSelected={setSelected}
					placeholder='Выбрать че то надо'
				/>
			</View>
		</SafeAreaView>
	)
}
