import React, { useEffect } from 'react'
import { initializeNotifications } from '@/utils/notifications/init'
import * as Notifications from 'expo-notifications'

export default function NotificationsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeNotifications()

    // Слушатель для получения уведомлений когда приложение открыто
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Получено уведомление:', notification)
    })

    // Слушатель для обработки нажатия на уведомление
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Нажато уведомление:', response)
      // Здесь можно добавить навигацию к задаче
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [])

  return <>{children}</>
}

export { NotificationsProvider } 