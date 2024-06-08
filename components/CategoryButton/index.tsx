import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from './styles'

export interface ICategoryButtonProps {
	id: number
	title: string
	handleCategory: (id: number) => void
	selectedCategory: number | null
	icon: JSX.Element
}
const CategoryButton: React.FC<ICategoryButtonProps> = ({
	id,
	title,
	handleCategory,
	selectedCategory,
	icon
}) => {
	const isCategorySelected = selectedCategory === id

	return (
		<TouchableOpacity
			style={[styles.categoryButton]}
			onPress={() => handleCategory(id)}
		>
			<View
				style={isCategorySelected ? styles.iconViewActive : styles.iconView}
			>
				{icon}
			</View>
			<Text
				style={
					isCategorySelected ? styles.selectedText : styles.placeholderCategory
				}
			>
				{title}
			</Text>
		</TouchableOpacity>
	)
}

export default CategoryButton
