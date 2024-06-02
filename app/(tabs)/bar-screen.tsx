import EducationIcon from '@/assets/svg/education-icon'
import HealthIcon from '@/assets/svg/health-icon'
import HouseIcon from '@/assets/svg/house-icon'
import OtherIcon from '@/assets/svg/other-icon'
import RestaurantsIcon from '@/assets/svg/restaurants-icon'
import TransportIcon from '@/assets/svg/transport-icon'
import Switcher from '@/components/Switcher'
import React, { useState } from 'react'
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
interface IBarData {
	category: string
	price: number
	color: string
	icon: JSX.Element
}

export default function BarScreen() {
	const [text, setText] = useState('1000')
	const [isEditing, setIsEditing] = useState(false)

	const handleEdit = () => {
		setIsEditing(true)
	}

	const handleSave = () => {
		setIsEditing(false)
	}

	const handleChange = (value: string) => {
		setText(value)
	}
	function transformData(dataDay: IBarData[]): {
		value: number
		topLabelComponent: () => JSX.Element
		frontColor: string
	}[] {
		return dataDay.map(item => {
			return {
				value: item.price,
				topLabelComponent: () => item.icon,
				frontColor: item.color
			}
		})
	}

	const dataDay: IBarData[] = [
		{
			category: 'Здоровье',
			price: 40,
			color: '#fe6f7b',
			icon: <HealthIcon color='red' />
		},
		{
			category: 'Образование',
			price: 20,
			color: '#69bffe',
			icon: <EducationIcon color='#69bffe' />
		},
		{
			category: 'Дом',
			price: 60,
			color: '#FFC047',
			icon: <HouseIcon color='#FFC047' />
		},
		{
			category: 'Кофе и рестораны',
			price: 80,
			color: '#93E850',
			icon: <RestaurantsIcon color='#93E850' />
		},
		{
			category: 'Транспорт',
			price: 10,
			color: '#9E73FC',
			icon: <TransportIcon color='#9E73FC' />
		},
		{
			category: 'Транспорт',
			price: 25,
			color: '#969696',
			icon: <OtherIcon color='#969696' />
		}
	]

	return (
		<SafeAreaView style={{ flex: 1, marginBottom: 5 }}>
			<View style={{ flex: 1, marginHorizontal: 16, marginVertical: 18 }}>
				<Switcher onLanguageChange={() => {}} switcherStyle={{}} />

				{/* <Switcher
					onLanguageChange={function (language: string): void {
						throw new Error('Function not implemented.')
					}}
					switcherStyle={undefined}
				/> */}
				<View>
					{isEditing ? (
						<TextInput
							value={text}
							onChangeText={handleChange}
							onBlur={handleSave}
							autoFocus
						/>
					) : (
						<TouchableOpacity onPress={handleEdit}>
							<Text style={{ fontWeight: 900, fontSize: 48, color: '#333333' }}>
								{text} Р
							</Text>
						</TouchableOpacity>
					)}
				</View>

				<View
					style={{
						flex: 1,
						width: '100%',
						height: 280,
						backgroundColor: '#ffffff',
						borderRadius: 30,
						marginTop: 20,
						marginBottom: 30,
						flexDirection: 'column'
					}}
				>
					<View style={styles.graphicsNames}>
						<TouchableOpacity>
							<Text style={styles.graphicName}>День</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={styles.graphicName}>Неделя</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={styles.graphicName}>Месяц</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={styles.graphicName}>Год</Text>
						</TouchableOpacity>
					</View>
					<View style={{ padding: 20, alignItems: 'center' }}>
						<BarChart
							barBorderRadius={4}
							hideRules
							hideYAxisText
							width={300}
							height={360}
							data={transformData(dataDay)}
							frontColor='#177AD5'
							yAxisThickness={0}
							xAxisThickness={0}
						/>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

