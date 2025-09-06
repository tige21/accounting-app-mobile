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

// Планирование уведомления с учетом времени напоминания
export async function scheduleTaskNotification(task: {
  id: string
  title: string
  date: string
  repeat?: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно'
  notificationTime?: string
  reminder?: 'Нет' | 'За 5 минут' | 'За 15 минут' | 'За 1 час' | 'За 1 день' | 'За 1 неделю'
}) {
  if (!task.notificationTime || !task.reminder || task.reminder === 'Нет') return null

  try {
    // Отменяем существующие уведомления для этой задачи
    await Notifications.getAllScheduledNotificationsAsync().then(notifications => {
      notifications.forEach(notification => {
        if (notification.content.data?.taskId === task.id) {
          Notifications.cancelScheduledNotificationAsync(notification.identifier)
        }
      })
    })

    const [hours, minutes] = task.notificationTime.split(':').map(Number)
    let notificationDates: Date[] = []
    
    // Базовая дата и время задачи
    const taskDateTime = dayjs(task.date).hour(hours).minute(minutes).second(0)
    
    // Рассчитываем время уведомления в зависимости от напоминания
    let baseNotificationTime = taskDateTime
    switch (task.reminder) {
      case 'За 5 минут':
        baseNotificationTime = taskDateTime.subtract(5, 'minutes')
        break
      case 'За 15 минут':
        baseNotificationTime = taskDateTime.subtract(15, 'minutes')
        break
      case 'За 1 час':
        baseNotificationTime = taskDateTime.subtract(1, 'hour')
        break
      case 'За 1 день':
        baseNotificationTime = taskDateTime.subtract(1, 'day')
        break
      case 'За 1 неделю':
        baseNotificationTime = taskDateTime.subtract(1, 'week')
        break
    }

    // Создаем массив дат уведомлений в зависимости от типа повторения
    switch (task.repeat || 'Никогда') {
      case 'Ежедневно':
        // Планируем на 30 дней вперед
        for (let i = 0; i < 30; i++) {
          notificationDates.push(baseNotificationTime.add(i, 'day').toDate())
        }
        break
      
      case 'Еженедельно':
        // Планируем на 12 недель вперед
        for (let i = 0; i < 12; i++) {
          notificationDates.push(baseNotificationTime.add(i, 'week').toDate())
        }
        break
      
      case 'Ежемесячно':
        // Планируем на 12 месяцев вперед
        for (let i = 0; i < 12; i++) {
          notificationDates.push(baseNotificationTime.add(i, 'month').toDate())
        }
        break
      
      case 'Ежегодно':
        // Планируем на 3 года вперед
        for (let i = 0; i < 3; i++) {
          notificationDates.push(baseNotificationTime.add(i, 'year').toDate())
        }
        break
      
      default:
        // Для одноразовых задач
        notificationDates = [baseNotificationTime.toDate()]
    }

    // Фильтруем прошедшие даты
    notificationDates = notificationDates.filter(date => date.getTime() > Date.now())

    // Планируем уведомления для всех дат
    const notificationIds = await Promise.all(
      notificationDates.map(async (date) => {
        try {
          return await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Напоминание о задаче',
              body: task.title,
              data: { 
                taskId: task.id,
                repeat: task.repeat 
              },
              sound: true,
            },
            trigger: {
              date,
            },
          })
        } catch (error) {
          console.error('Error scheduling single notification:', error)
          return null
        }
      })
    )

    // Возвращаем первый ID для сохранения в задаче
    return notificationIds[0]
  } catch (error) {
    console.error('Error scheduling notifications:', error)
    return null
  }
}

// Отмена уведомлений
export async function cancelTaskNotification(taskId: string) {
  try {
    // Отменяем все уведомления для задачи
    const notifications = await Notifications.getAllScheduledNotificationsAsync()
    for (const notification of notifications) {
      if (notification.content.data?.taskId === taskId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier)
      }
    }
  } catch (error) {
    console.error('Error canceling notifications:', error)
  }
} 