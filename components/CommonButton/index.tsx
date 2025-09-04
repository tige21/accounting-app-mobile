import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import ThemedText from '@/components/ThemedText'
import styles from './styles'

interface IButton {
	placeholder: string
	isCancel?: boolean
	onPress: () => void
}

const CommonButton: React.FC<IButton> = ({ placeholder, isCancel, onPress }) => {
	let buttonStyle: object = isCancel
		? styles.buttonModalCancel
		: styles.buttonStyle
	let textStyle: object = isCancel
		? styles.buttonTextModalCancel
		: styles.buttonTextStyle

	return (
		<TouchableOpacity style={buttonStyle} onPress={onPress}>
			<ThemedText style={textStyle}>{placeholder}</ThemedText>
		</TouchableOpacity>
	)
}

export default CommonButton
