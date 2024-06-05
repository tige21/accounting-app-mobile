import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import styles from './styles'

interface ICalendarPickButtonProps {
    handlePresent: () => void
}
const CalendarPickButton: React.FC<ICalendarPickButtonProps> = ({handlePresent}) => {
	return (
		<TouchableOpacity onPress={handlePresent} style={styles.button}>
			<Feather name='calendar' size={24} color='white' />
		</TouchableOpacity>
	)
}

export default CalendarPickButton
