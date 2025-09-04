import React, { useMemo, useCallback, memo } from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import ThemedView from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import BackButton from '@/components/BackButton';
import { useTransactionStore } from '@/store/transactionStore';
import dayjs from 'dayjs';
import { useSettingsStore } from '@/store/settingsStore';

interface Transaction {
  id: string;
  category: string;
  price: number;
  color: string;
  type: 'income' | 'expense';
  date: Date;
  description: string;
}

interface GroupedTransaction {
  title: string; // Дата в формате "DD MMMM YYYY"
  data: Transaction[];
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

  // Мемоизированный компонент транзакции для оптимизации производительности
  const TransactionItem = memo(({ transaction }: { transaction: Transaction }) => (
    <ThemedView 
      colorName="surface"
      style={[
        styles.transactionItem,
        { borderLeftColor: transaction.color }
      ]}
    >
      <ThemedView style={styles.transactionInfo}>
        <ThemedText type="defaultSemiBold">
          {transaction.category}
        </ThemedText>
        <ThemedText type="body" lightColor={Colors.grey_2}>
          {transaction.description}
        </ThemedText>
      </ThemedView>
      <ThemedText 
        type="defaultSemiBold"
        lightColor={transaction.type === 'income' ? '#34C759' : '#FF3B30'}
      >
        {transaction.type === 'income' ? '+' : '-'}
        {transaction.price} {currency.symbol}
      </ThemedText>
    </ThemedView>
  ), (prevProps, nextProps) => {
    return (
      prevProps.transaction.id === nextProps.transaction.id &&
      prevProps.transaction.price === nextProps.transaction.price &&
      prevProps.transaction.category === nextProps.transaction.category
    );
  });

  // Оптимизированный компонент группы транзакций с FlatList вместо map
  const DateGroup = memo(({ group }: { group: GroupedTransaction }) => {
    const renderTransaction = useCallback(
      ({ item }: ListRenderItemInfo<Transaction>) => (
        <TransactionItem transaction={item} />
      ),
      []
    );

    const keyExtractor = useCallback((item: Transaction) => item.id, []);

    return (
      <ThemedView style={styles.dateGroup}>
        <ThemedText type="defaultSemiBold" lightColor={Colors.grey_2}>{group.title}</ThemedText>
        {group.data.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </ThemedView>
    );
  });

  const renderDateGroup = useCallback(
    ({ item }: ListRenderItemInfo<GroupedTransaction>) => (
      <DateGroup group={item} />
    ),
    []
  );

  const keyExtractor = useCallback((item: GroupedTransaction) => item.title, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton handleBack={handleBack} />
      
      <ThemedView style={styles.content}>
        <ThemedText type="heading">История операций</ThemedText>

        <FlatList
          data={groupedTransactions}
          renderItem={renderDateGroup}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          maxToRenderPerBatch={3} // Рендерим по 3 группы за раз
          windowSize={8} // Количество экранов для предзагрузки
          initialNumToRender={5} // Начальное количество групп
          updateCellsBatchingPeriod={100} // Батчинг обновлений
          removeClippedSubviews={true} // Удаляем элементы вне области видимости
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText type="default" lightColor={Colors.grey_2} style={styles.emptyText}>
                У вас пока нет транзакций
              </ThemedText>
            </ThemedView>
          }
        />
      </ThemedView>
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
    fontSize: 16,
    fontWeight: '500'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
}); 