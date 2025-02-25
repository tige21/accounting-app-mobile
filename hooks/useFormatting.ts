import { useSettingsStore } from '@/store/settingsStore'

export const useFormatting = () => {
  const { currency } = useSettingsStore()

  const formatNumber = (num: number): string => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const formatCurrency = (amount: number): string => {
    return `${formatNumber(amount)} ${currency.symbol} `
  }

  return {
    formatNumber,
    formatCurrency
  }
} 