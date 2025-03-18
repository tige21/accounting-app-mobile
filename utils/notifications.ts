import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import dayjs from 'dayjs'

// Конфигурация уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Запрос разрешений для уведомлений
export async function requestNotificationsPermissions() {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

// Планирование уведомления
export const scheduleTaskNotification = async ({
  id,
  title,
  date,
  notificationTime,
  repeat = 'Никогда'
}: {
  id: string
  title: string
  date: string
  notificationTime: string
  repeat?: string
}) => {
  try {
    const [hours, minutes] = notificationTime.split(':').map(Number)
    const notificationDate = dayjs(date)
      .hour(hours)
      .minute(minutes)
      .toDate()

    let trigger: any = {
      hour: hours,
      minute: minutes,
    }

    // Добавляем повторение в зависимости от выбранного варианта
    switch (repeat) {
      case 'Ежедневно':
        trigger.repeats = true
        break
      case 'Еженедельно':
        trigger.repeats = true
        trigger.weekday = notificationDate.getDay() + 1 // 1-7
        break
      case 'Ежемесячно':
        trigger.repeats = true
        trigger.day = notificationDate.getDate()
        break
      case 'Ежегодно':
        trigger.repeats = true
        trigger.day = notificationDate.getDate()
        trigger.month = notificationDate.getMonth() + 1 // 1-12
        break
      default:
        // Для "Никогда" используем конкретную дату
        trigger = notificationDate
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: title,
        data: { taskId: id },
      },
      trigger,
    })

    return notificationId
  } catch (error) {
    console.error('Error scheduling notification:', error)
    return null
  }
}

// Отмена уведомления
export async function cancelTaskNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
  } catch (error) {
    console.error('Error canceling notification:', error)
  }
} 