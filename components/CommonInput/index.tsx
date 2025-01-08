import { View, Text, TextInput, TextInputProps } from 'react-native'
import React from 'react'
import styles from './styles'
import Colors from '@/constants/Colors'

interface ICommonInputProps extends TextInputProps {
	placeholder: string
	value?: string
	onChangeText?: (text: string) => void
}

const CommonInput: React.FC<ICommonInputProps> = ({
	placeholder,
	value,
	onChangeText,
	...props
}) => {
	return (
		<View style={styles.inputView}>
			<TextInput
				style={styles.inputText}
				placeholder={placeholder}
				placeholderTextColor={Colors.grey_1}
				value={value}
				onChangeText={onChangeText}
				{...props}
			/>
		</View>
	)
}

export default CommonInput
