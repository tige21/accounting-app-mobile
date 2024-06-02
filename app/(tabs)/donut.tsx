import EntertainmentIcon from '@/assets/svg/entertainment-icon'
import HealthIcon from '@/assets/svg/health-icon'
import HouseIcon from '@/assets/svg/house-icon'
import Switcher from '@/components/Switcher'
import React, { useEffect, useState } from 'react'
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'

interface IData {
	category: string
	price: number
	color: string
}

export default function donut() {
	const dataDay = [
		{
			category: 'Здоровье',
			price: 10,
			color: '#fe6f7b',
			icon: <HealthIcon color='white' />
		},
		{ category: 'Образование', price: 20, color: '#69bffe' }
	]

	const dataWeek = [
		{
			category: 'Развлечения',
			price: 30,
			color: '#f584ff',
			icon: <EntertainmentIcon color='white' />
		},
		{
			category: 'Дом',
			price: 40,
			color: '#ffc047',
			icon: <HouseIcon color='#ffc047' />
		},
		{ category: 'Кафе и рестораны', price: 50, color: '#93e850' }
	]

	const dataMonth = [
		{ category: 'Транспорт', price: 60, color: '#9e73fc' },
		{ category: 'Продуты', price: 70, color: '#6871fc' }
	]

	const dataYear = [
		{ category: 'Здоровье', price: 10, color: '#fe6f7b' },
		{ category: 'Образование', price: 20, color: '#69bffe' },
		{ category: 'Развлечения', price: 30, color: '#f584ff' },
		{ category: 'Дом', price: 40, color: '#ffc047' },
		{ category: 'Кафе и рестораны', price: 50, color: '#93e850' },
		{ category: 'Транспорт', price: 60, color: '#9e73fc' },
		{ category: 'Продуты', price: 70, color: '#6871fc' }
	]

	const dataPie = (data: IData[]) => {
		return data.map((item: IData) => ({
			value: item.price,
			color: item.color
		}))
	}

	const [selectedTimeFrame, setSelectedTimeFrame] = useState('day')
	const [data, setData] = useState(dataDay)
	const [dataForPie, setDataForPie] = useState(dataPie(data))
	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState('1000')

	const handleEdit = () => {
		setIsEditing(true)
	}

	const handleSave = () => {
		setIsEditing(false)
	}

	const handleChange = (value: string) => {
		setText(value)
	}

	const handleTimeFrameChange = (timeFrame: string) => {
		setSelectedTimeFrame(timeFrame)

		switch (timeFrame) {
			case 'day':
				setData(dataDay)
				break
			case 'week':
				setData(dataWeek)
				break
			case 'month':
				setData(dataMonth)
				break
			case 'year':
				setData(dataYear)
				break
			default:
				setData(dataDay)
		}
	}

	useEffect(() => {
		setDataForPie(dataPie(data))
	}, [data])

	return (
		<SafeAreaView style={{ flex: 1, marginBottom: -15 }}>
			<View style={{ flex: 1, marginHorizontal: 16, marginVertical: 18 }}>
				<Switcher onLanguageChange={() => {}} switcherStyle={{}} />

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
						width: '100%',
						height: 280,
						backgroundColor: '#ffffff',
						borderRadius: 30,
						marginTop: 20,
						flexDirection: 'column'
					}}
				>
					<View style={styles.graphicsNames}>
						<TouchableOpacity onPress={() => handleTimeFrameChange('day')}>
							<Text style={styles.graphicName}>День</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleTimeFrameChange('week')}>
							<Text style={styles.graphicName}>Неделя</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleTimeFrameChange('month')}>
							<Text style={styles.graphicName}>Месяц</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleTimeFrameChange('year')}>
							<Text style={styles.graphicName}>Год</Text>
						</TouchableOpacity>
					</View>
					<View
						style={{
							alignItems: 'center',
							marginBottom: 30
						}}
					>
						<PieChart innerRadius={55} radius={90} data={dataForPie} donut />
					</View>
				</View>
				<ScrollView style={styles.transactions}>
					{data.map((item, index) => (
						<View key={index} style={styles.transactionItem}>
							<View
								style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
							>
								<View
									style={{
										backgroundColor: item.color,
										borderRadius: 50,
										height: 36,
										width: 36,
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									{item.icon}
								</View>
								<Text
									style={{ color: '#333333', fontSize: 18, fontWeight: 500 }}
								>
									{item.category}
								</Text>
							</View>
							{/* <Text style={styles.transactionText}>1000 Р</Text> */}
							<Text style={{ color: '#333333', fontSize: 18, fontWeight: 800 }}>
								{item.price} P
							</Text>
						</View>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	graphicsNames: {
		flex: 1,
		margin: 20,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	graphicName: {
		color: '#A9ABE4'
	},
	transactions: {
		marginTop: 30,
		width: '100%',
		flexDirection: 'column',
		paddingBottom: 20,
		flex: 1
	},
	transactionItem: {
		height: 60,
		borderRadius: 10,
		alignItems: 'center',
		backgroundColor: '#ffffff',
		padding: 20,
		marginBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	transactionText: {
		color: '#333333',
		fontSize: 18,
		fontWeight: 500
	}
})
