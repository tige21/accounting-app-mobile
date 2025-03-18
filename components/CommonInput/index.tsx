import React from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import Colors from '@/constants/Colors'

interface CommonInputProps extends TextInputProps {
	// добавляем дополнительные пропсы если нужно
}

export default function CommonInput(props: CommonInputProps) {
	return (
		<TextInput
			{...props}
			style={[styles.input, props.style]}
			placeholderTextColor={Colors.grey_2}
			scrollEnabled={false} // Отключаем внутренний скролл
		/>
	)
}

const styles = StyleSheet.create({
	input: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		fontSize: 16,
		color: Colors.black,
	},
})
