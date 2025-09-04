import { useSettingsStore } from '@/store/settingsStore'
import { useCurrencyRates } from './useCurrencyRates'

export const useTransactions = () => {
  const { currency } = useSettingsStore()
  const { data: ratesData } = useCurrencyRates()

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (!ratesData) return amount

    const fromRate = fromCurrency === 'RUB' ? 1 : ratesData.Valute[fromCurrency]?.Value || 1
    const toRate = toCurrency === 'RUB' ? 1 : ratesData.Valute[toCurrency]?.Value || 1

    // Конвертируем через рубли
    const amountInRub = amount * fromRate
    return amountInRub / toRate
  }

  return {
    convertAmount,
    currentCurrency: currency
  }
} 