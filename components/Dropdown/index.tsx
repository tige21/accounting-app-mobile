import React, { useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	ViewStyle,
	TextStyle
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import styles from './styles'

export interface DropdownProps {
	setSelected: Function
	placeholder?: string
	data: Array<{}>
	defaultOption?: { key: any; value: any }
	onSelect?: () => void
	save?: 'key' | 'value'
}
const Dropdown: React.FC<DropdownProps> = ({
	setSelected,
	placeholder = 'Select an option',
	data = [],
	defaultOption,
	onSelect,
	save = 'value',
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(defaultOption || null)

	const handleSelect = item => {
		setSelectedOption(item)
		setSelected(save === 'key' ? item.key : item.value)
		if (onSelect) onSelect()
		setIsOpen(false)
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.input}
				onPress={() => setIsOpen(!isOpen)}
			>
				<Text style={selectedOption ? styles.selectedText : styles.placeholder}>
					{selectedOption ? selectedOption.value : placeholder}
				</Text>
				<AntDesign name={isOpen ? 'up' : 'down'} size={24} color='blue' />
			</TouchableOpacity>
			{isOpen && (
				<View style={styles.dropdown}>
					<FlatList
						data={data}
						keyExtractor={item => item.key.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.item}
								onPress={() => handleSelect(item)}
							>
								<View style={styles.itemContent}>
									<AntDesign
										name={
											selectedOption && selectedOption.key === item.key
												? 'checkcircle'
												: 'circledowno'
										}
										size={16}
										color={
											selectedOption && selectedOption.key === item.key
												? 'blue'
												: 'black'
										}
										style={styles.icon}
									/>
									<Text
										style={[
											styles.itemText,
											selectedOption && selectedOption.key === item.key
												? styles.selectedItemText
												: {}
										]}
									>
										{item.value}
									</Text>
								</View>
							</TouchableOpacity>
						)}
					/>
				</View>
			)}
		</View>
	)
}



export default Dropdown
