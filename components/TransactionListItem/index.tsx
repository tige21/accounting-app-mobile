import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
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
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.category}>{category}</Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.amount}>
          {formatNumber(convertedAmount)} {currency.symbol}
        </Text>
      </View>
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