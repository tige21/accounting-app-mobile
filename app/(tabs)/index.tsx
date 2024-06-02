import CustomBottomSheetModal from '@/components/CalendarPickModal'
import Colors from '@/constants/Colors'
import { Feather } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Picker } from '@react-native-picker/picker'
import React, { useRef, useState } from 'react'
import {
	KeyboardAvoidingView,
	Text,
	TouchableOpacity,
	View,
	StyleSheet
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function AddScreen() {
	const [selectedLanguage, setSelectedLanguage] = useState<string>('expenses')
	const bottomSheetRef = useRef<BottomSheetModal>(null)
	let contentToDisplay = null

	if (selectedLanguage === 'expenses') {
		contentToDisplay = (
			<View>
				<Text>lalalalala</Text>
			</View>
		)
	} else if (selectedLanguage === 'income') {
		contentToDisplay = (
			<View>
				<Text>bebebebeb</Text>
			</View>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView>
				<View style={{ marginHorizontal: 16, marginVertical: 10 }}>
					<Ionicons name='chevron-back' size={32} color={Colors.grey_2} />
				</View>
				<View
					style={styles.mainTextContainer}
				>
					<TouchableOpacity onPress={() => setSelectedLanguage('expenses')}>
						<Text style={styles.mainText}>Расход</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setSelectedLanguage('income')}>
						<Text style={styles.mainText}>Доход</Text>
					</TouchableOpacity>
				</View>
				{contentToDisplay}
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	mainText: {
		fontSize: 24,
		color: Colors.blue,
		fontWeight: 'bold'
	},
	mainTextContainer: {
		flexDirection: 'row',
		gap: 126,
		justifyContent: 'center',
		
	}
})