import React, { useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import styles from './styles'
import Colors from '@/constants/Colors'
import SvgComponentSelected from '@/assets/images/svg/select'
import SvgComponent from '@/assets/images/svg/circle'

export interface DropdownProps {
	setSelected: (value: any) => void
	placeholder?: string
	data: Array<{ key: any; value: any }>
	defaultOption?: { key: any; value: any }
	onSelect?: () => void
	save?: 'key' | 'value'
}
const Dropdown: React.FC<DropdownProps> = ({
	setSelected,
	placeholder = 'Выбрать',
	data = [],
	defaultOption,
	save = 'value'
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(defaultOption || null)

	const handleSelect = (item: { key: any; value: any }) => {
		setSelectedOption(item)
		setSelected(save === 'key' ? item.key : item.value)
		setIsOpen(false)
	}

	return (
		<View style={styles.dropdownView}>
			<TouchableOpacity
				style={styles.selectedContainer}
				onPress={() => setIsOpen(!isOpen)}
			>
					<Text
						style={
							selectedOption ? styles.selectedText : styles.placeholderText
						}
					>
						{selectedOption ? selectedOption.value : placeholder}
					</Text>
				<Entypo
					name={isOpen ? 'chevron-up' : 'chevron-down'}
					size={24}
					color={Colors.blue}
				/>
			</TouchableOpacity>

			{isOpen && (
				<View style={styles.listView}>
					<FlatList
						data={data}
						keyExtractor={item => item.key.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => handleSelect(item)}>
								<View style={styles.dropdownOptions}>
									{selectedOption && selectedOption.key === item.key ? (
										<SvgComponentSelected style={styles.icon} />
									) : (
										<SvgComponent style={styles.icon} />
									)}
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
