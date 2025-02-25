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
    staleTime: 1000 * 60 * 60, // Обновляем раз в час
    refetchOnWindowFocus: false
  })
} 