import { View, Text, TextInput } from 'react-native'
import React from 'react'
import styles from './styles'
import Colors from '@/constants/Colors'

interface ICommonInputProps {
	placeholder: string
}
const CommonInput: React.FC<ICommonInputProps> = ({placeholder}) => {
	return (
		<View style={styles.inputView}>
			<TextInput
				style={styles.inputText}
				placeholder={placeholder}
				placeholderTextColor={Colors.grey_1}
			/>
		</View>
	)
}

export default CommonInput
