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
	View
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function AddScreen() {
	const [selectedLanguage, setSelectedLanguage] = useState()
	const bottomSheetRef = useRef<BottomSheetModal>(null)

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView>
				<View style={{marginHorizontal: 32, marginVertical: 10}}>
					<Ionicons name='chevron-back' size={36} color={Colors.grey_2} />
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}
