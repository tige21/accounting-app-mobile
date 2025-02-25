import { useSettingsStore } from "@/store/settingsStore";

const { currency } = useSettingsStore()


export const formatNumber = (num: number): string => {
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const formatCurrency = (amount: number, symbol: string): string => {
  return `${symbol} ${formatNumber(amount)}`;
}; 

export const formatAmount = (amount: number): string => {
    return formatCurrency(amount, currency.symbol)
}