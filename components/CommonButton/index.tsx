import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from './styles'

interface IButton {
	placeholder: string
	isCancel?: boolean
}

const CommonButton: React.FC<IButton> = ({ placeholder, isCancel }) => {
	let buttonStyle: object = isCancel
		? styles.buttonModalCancel
		: styles.buttonStyle
	let textStyle: object = isCancel
		? styles.buttonTextModalCancel
		: styles.buttonTextStyle

	return (
		<TouchableOpacity style={buttonStyle}>
			<Text style={textStyle}>{placeholder}</Text>
		</TouchableOpacity>
	)
}

export default CommonButton
