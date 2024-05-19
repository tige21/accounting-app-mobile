import Colors from '@/constants/Colors'
import { Feather } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import {
	KeyboardAvoidingView,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
export default function index() {
	const [selectedLanguage, setSelectedLanguage] = useState()

	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
				marginTop: 100
			}}
		>
			<View
				style={{ flex: 1, marginHorizontal: 16, marginVertical: 18, gap: 55 }}
			>
				<Text
					style={{
						fontWeight: 'bold',
						fontSize: 24,
						color: '#333333',
						textAlign: 'center'
					}}
				>
					Добавление транзакции
				</Text>
				<View
					style={{
						width: '100%',
						backgroundColor: 'white',
						height: 45,
						justifyContent: 'center',
						paddingHorizontal: 20,
						borderRadius: 10
					}}
				>
					<TextInput
						style={{ color: Colors.grey, fontSize: 17, marginLeft: 18 }}
						placeholder='Сумма транзакции'
					/>
				</View>

				{/* <View
					style={{
						width: '100%',
						backgroundColor: 'white',
						height: 45,
						justifyContent: 'center',
						paddingHorizontal: 20,
						borderRadius: 10
					}}
				>
					<TextInput
						style={{ color: Colors.grey, fontSize: 17 }}
						placeholder='Здоровье'
					/>
				</View> */}
				<View
					style={{
						width: '100%',
						backgroundColor: 'white',
						height: 45,
						justifyContent: 'center',
						paddingHorizontal: 20,
						borderRadius: 10
					}}
				>
					<Picker
						style={{ color: Colors.grey, fontSize: 17 }}
						selectedValue={selectedLanguage}
						onValueChange={(itemValue, itemIndex) =>
							setSelectedLanguage(itemValue)
						}
					>
						<Picker.Item label='Java' value='java' />
						<Picker.Item label='JavaScript' value='js' />
					</Picker>
				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<View
						style={{
							width: '70%',
							backgroundColor: 'white',
							height: 45,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 20,
							borderRadius: 10
						}}
					>
						<Text style={{ color: Colors.grey, fontSize: 17 }}>
							16 мая 2024
						</Text>
					</View>
					<TouchableOpacity
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 25,
							backgroundColor: '#3D42C4',
							height: 50,
							width: 50,
							marginRight: 20
						}}
					>
						<Feather name='calendar' size={24} color='white' />
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={{
						height: 50,
						width: '100%',
						backgroundColor: '#3D42C4',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 10
					}}
				>
					<Text
						style={{
							fontWeight: 'medium',
							fontSize: 17,
							color: 'white',
							textAlign: 'center'
						}}
					>
						Сохранить
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	)
}
