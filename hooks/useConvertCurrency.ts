import { useCurrencyRates } from '@/hooks/useCurrencyRates'
import { useSettingsStore } from '@/store/settingsStore'

export const useConvertCurrency = () => {
  const { currency } = useSettingsStore()
  const { data: ratesData } = useCurrencyRates()

  const convertAmount = (amount: number, fromCurrency = 'RUB'): number => {
    if (!ratesData || fromCurrency === currency.code) return amount

    if (currency.code === 'RUB') return amount

    const rate = ratesData.Valute[currency.code]?.Value || 1
    return amount / rate
  }
  const formatNumber = (num: number): string => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const formatCurrencyAmount = (amount: number): string => {
    return `${currency.symbol} ${formatNumber(convertAmount(amount))}`
  }

  return {
    convertAmount,
    formatCurrencyAmount,
    currentCurrency: currency
  }
} 