import { View, Text, TextInput, TextInputProps } from 'react-native'
import React from 'react'
import styles from './styles'
import Colors from '@/constants/Colors'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

interface ICommonInputProps extends TextInputProps {
	placeholder: string
	value?: string
	onChangeText?: (text: string) => void
	isModal?: boolean
}

const CommonInput: React.FC<ICommonInputProps> = ({
	placeholder,
	value,
	onChangeText,
	isModal = false,
	...props
}) => {
	const InputComponent = isModal ? BottomSheetTextInput : TextInput

	return (
		<View style={styles.inputView}>
			<InputComponent
				style={styles.inputText}
				placeholder={placeholder}
				placeholderTextColor={Colors.grey_1}
				value={value}
				blurOnSubmit={true}
				onChangeText={onChangeText}
				{...props}
			/>
		</View>
	)
}

export default CommonInput
