import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

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
export async function scheduleTaskNotification(task: {
  id: string
  title: string
  date: string
  notificationTime?: string // время уведомления в формате "HH:mm"
}) {
  if (!task.notificationTime) return null

  const [hours, minutes] = task.notificationTime.split(':').map(Number)
  const notificationDate = new Date(task.date)
  notificationDate.setHours(hours, minutes, 0)

  // Если дата уже прошла, не создаем уведомление
  if (notificationDate.getTime() <= Date.now()) return null

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Напоминание о задаче',
        body: task.title,
        data: { taskId: task.id },
      },
      trigger: {
        date: notificationDate,
      },
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