import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import ThemedView from '@/components/ThemedView'
import Colors from '@/constants/Colors'
import ThemedText from '@/components/ThemedText'
import { useSettingsStore } from '@/store/settingsStore'
import { useConvertCurrency } from '@/hooks/useConvertCurrency'

interface TransactionListItemProps {
  icon: React.ReactNode
  category: string
  amount: number
  percentage: number
  onLongPress?: (category: string) => void
  delayLongPress?: number
}

const TransactionListItem = ({ icon, category, amount, percentage, onLongPress, delayLongPress = 500 }: TransactionListItemProps) => {
  const { currency } = useSettingsStore()
  const { convertAmount } = useConvertCurrency()

  const formatNumber = (num: number): string => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }
  const convertedAmount = convertAmount(amount)

  return (
    <TouchableOpacity onLongPress={() => onLongPress?.(category)} delayLongPress={delayLongPress} activeOpacity={0.7} style={styles.container}>
      <ThemedView style={styles.leftContent}>
        <ThemedView style={styles.iconContainer}>
          {icon}
        </ThemedView>
        <ThemedText type="defaultSemiBold">{category}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.rightContent}>
        <ThemedText type="body" lightColor={Colors.grey_2}>{percentage}%</ThemedText>
        <ThemedText type="defaultSemiBold">
          {formatNumber(convertedAmount)} {currency.symbol}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  category: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.black,
  },
  rightContent: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 16,
  },
  percentage: {
    fontSize: 15,
    color: Colors.grey_2,
    marginBottom: 2,
  },
  amount: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.black,
  },
})

export default TransactionListItem 