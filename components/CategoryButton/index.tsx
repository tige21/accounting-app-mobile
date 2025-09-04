import { TouchableOpacity } from 'react-native'
import React from 'react'
import ThemedView from '@/components/ThemedView'
import ThemedText from '@/components/ThemedText'
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
			<ThemedView
				colorName={isCategorySelected ? "surface" : "background"}
				style={isCategorySelected ? styles.iconViewActive : styles.iconView}
			>
				{icon}
			</ThemedView>
			<ThemedText
				type="caption"
				style={
					isCategorySelected ? styles.selectedText : styles.placeholderCategory
				}
			>
				{title}
			</ThemedText>
		</TouchableOpacity>
	)
}

export default CategoryButton
