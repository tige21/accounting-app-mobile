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

  try {
    const [hours, minutes] = task.notificationTime.split(':').map(Number)
    const notificationDate = new Date(task.date)
    notificationDate.setHours(hours, minutes, 0, 0)

    // Если дата уже прошла, не создаем уведомление
    if (notificationDate.getTime() <= Date.now()) return null

    // Отменяем существующие уведомления для этой задачи
    await Notifications.getAllScheduledNotificationsAsync().then(notifications => {
      notifications.forEach(notification => {
        if (notification.content.data?.taskId === task.id) {
          Notifications.cancelScheduledNotificationAsync(notification.identifier)
        }
      })
    })

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Напоминание о задаче',
        body: task.title,
        data: { taskId: task.id },
        sound: true,
      },
      trigger: {
        date: notificationDate,
        seconds: 1, // минимальная задержка
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