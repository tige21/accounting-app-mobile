import { useQuery } from '@tanstack/react-query'

interface CurrencyRate {
  ID: string
  NumCode: string
  CharCode: string
  Nominal: number
  Name: string
  Value: number
  Previous: number
}

interface CurrencyResponse {
  Date: string
  PreviousDate: string
  PreviousURL: string
  Timestamp: string
  Valute: {
    [key: string]: CurrencyRate
  }
}

const fetchCurrencyRates = async (): Promise<CurrencyResponse> => {
  const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
  return response.json()
}

export const useCurrencyRates = () => {
  return useQuery({
    queryKey: ['currencyRates'],
    queryFn: fetchCurrencyRates,
    staleTime: 1000 * 60 * 60 * 4, // Обновляем раз в 4 часа вместо 1 часа
    cacheTime: 1000 * 60 * 60 * 24, // Кешируем на 24 часа
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Не обновляем при каждом монтировании
    refetchOnReconnect: true, // Обновляем только при восстановлении соединения
    retry: 3, // Повторяем при ошибке максимум 3 раза
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Экспоненциальная задержка
    networkMode: 'online', // Запрашиваем только при онлайн-соединении
  })
} 