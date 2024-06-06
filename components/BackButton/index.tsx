import Colors from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { TouchableOpacity } from "react-native"
import styles from "./styles"

interface IBackButton {
	handleBack: () => void
}

const BackButton: React.FC<IBackButton> = ({ handleBack }) => (
	<TouchableOpacity onPress={handleBack} style={styles.iconBack}>
		<Ionicons name='chevron-back' size={24} color={Colors.grey_2} />
	</TouchableOpacity>
)

export default BackButton