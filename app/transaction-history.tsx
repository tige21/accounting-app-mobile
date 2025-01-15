import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import BackButton from '@/components/BackButton';
import { useTransactionStore } from '@/store/transactionStore';
import dayjs from 'dayjs';
import { useSettingsStore } from '@/store/settingsStore';

interface GroupedTransaction {
  title: string; // Дата в формате "DD MMMM YYYY"
  data: Array<{
    id: string;
    category: string;
    price: number;
    color: string;
    type: 'income' | 'expense';
    date: Date;
    description: string;
  }>;
}

export default function TransactionHistoryScreen() {
  const { transactions } = useTransactionStore();
  const { currency } = useSettingsStore();

  // Группируем транзакции по датам
  const groupedTransactions = useMemo(() => {
    const groups = transactions.reduce((acc, transaction) => {
      const date = dayjs(transaction.date).format('DD MMMM YYYY');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, typeof transactions>);

    // Преобразуем в массив для FlatList
    return Object.entries(groups)
      .map(([date, transactions]) => ({
        title: date,
        data: transactions.sort((a, b) => 
          dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
        )
      }))
      .sort((a, b) => 
        dayjs(b.data[0].date).valueOf() - dayjs(a.data[0].date).valueOf()
      );
  }, [transactions]);

  const handleBack = () => {
    router.back();
  };

  const renderTransaction = ({ item: transaction }) => (
    <View 
      style={[
        styles.transactionItem,
        { borderLeftColor: transaction.color }
      ]}
    >
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionCategory}>
          {transaction.category}
        </Text>
        <Text style={styles.transactionDescription}>
          {transaction.description}
        </Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        transaction.type === 'income' ? styles.positive : styles.negative
      ]}>
        {transaction.type === 'income' ? '+' : '-'}
        {transaction.price} {currency.symbol}
      </Text>
    </View>
  );

  const renderDateGroup = ({ item: group }: { item: GroupedTransaction }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateTitle}>{group.title}</Text>
      {group.data.map(transaction => (
        <View key={transaction.id}>
          {renderTransaction({ item: transaction })}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackButton handleBack={handleBack} />
      
      <View style={styles.content}>
        <Text style={styles.title}>История операций</Text>

        <FlatList
          data={groupedTransactions}
          renderItem={renderDateGroup}
          keyExtractor={item => item.title}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              У вас пока нет транзакций
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.grey_2,
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: Colors.grey_2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.grey_2,
    marginTop: 24,
  },
}); 