import React from 'react'
import { TextInput, TextInputProps, Platform } from 'react-native'
import { useDynamicStyles, useTheme } from '@/hooks'

interface CommonInputProps extends TextInputProps {
	isModal?: boolean
}

export default function CommonInput({ isModal, ...props }: CommonInputProps) {
	const { isDark } = useTheme()
	
	const styles = useDynamicStyles((colors) => ({
		input: {
			backgroundColor: colors.inputBackground,
			borderRadius: 12,
			padding: 12,
			fontSize: 16,
			color: colors.inputText
		},
		placeholder: {
			color: colors.inputPlaceholder,
		}
	}))

	return (
		<TextInput
			{...props}
			style={[styles.input, props.style]}
			placeholderTextColor={styles.placeholder.color}
			scrollEnabled={false}
			keyboardAppearance={isDark ? 'dark' : 'light'} // Поддержка темной клавиатуры
		/>
	)
}
