import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export async function initializeNotifications() {
  // Запрашиваем разрешения для уведомлений
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!')
    return false
  }

  // Настраиваем как будут показываться уведомления когда приложение открыто
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // показывать алерт если приложение открыто
      shouldPlaySound: true, // проигрывать звук
      shouldSetBadge: true, // показывать бейдж (iOS)
    }),
  })

  // Для Android настраиваем канал уведомлений
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return true
} 