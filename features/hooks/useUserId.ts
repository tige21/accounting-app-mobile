import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

export const useUserId = () => {
	const [userId, setUserId] = useState<any>(null)

	useEffect(() => {
		(async () => {
			const user_id = await AsyncStorage.getItem('user_id')
			setUserId(user_id)
		})()
	}, [])

	return userId
}
