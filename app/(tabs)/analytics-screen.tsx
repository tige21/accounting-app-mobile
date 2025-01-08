import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore } from '@/store/financeStore';
import Colors from '@/constants/Colors';
import { CommonInput } from '@/components';
import { PieChart } from 'react-native-gifted-charts';
import { useTransactionStore } from '@/store/transactionStore';

export default function AnalyticsScreen() {
  const { 
    transactions,
    getTotalExpenses,
    getTotalIncome 
  } = useTransactionStore();
  
  const { 
    monthlyBudget, 
    setMonthlyBudget, 
    getCurrentBalance 
  } = useFinanceStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [currentBalance, setCurrentBalance] = useState(getCurrentBalance());

  useEffect(() => {
    setCurrentBalance(getCurrentBalance());
  }, [transactions, monthlyBudget]);

  // Группировка транзакций по категориям
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.category === curr.category);
      if (existing) {
        existing.value += curr.price;
      } else {
        acc.push({
          value: curr.price,
          category: curr.category,
          color: curr.color
        });
      }
      return acc;
    }, [] as Array<{ value: number; category: string; color: string }>);

  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();

  const handleBudgetSave = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      setMonthlyBudget(amount);
    }
    setIsEditing(false);
  };

  const pieData = expensesByCategory.map(item => ({
    value: item.value,
    color: item.color,
    text: `${((item.value / totalExpenses) * 100).toFixed(1)}%`
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Аналитика</Text>

        <View style={styles.budgetCard}>
          <Text style={styles.label}>Бюджет на месяц</Text>
          {isEditing ? (
            <View style={styles.editContainer}>
              <CommonInput
                placeholder="Введите сумму"
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                autoFocus
                onBlur={handleBudgetSave}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.amount}>{monthlyBudget} ₽</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Text style={styles.label}>Остаток</Text>
            <Text style={[styles.amount, currentBalance < 0 && styles.negative]}>
              {currentBalance} ₽
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progress, 
                { width: `${Math.max(0, Math.min(100, (currentBalance / monthlyBudget) * 100))}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Статистика расходов</Text>
          {pieData.length > 0 ? (
            <>
              <View style={styles.chartContainer}>
                <PieChart
                  data={pieData}
                  donut
                  radius={120}
                  innerRadius={80}
                  centerLabelComponent={() => (
                    <View style={styles.centerLabel}>
                      <Text style={styles.centerLabelText}>
                        {totalExpenses} ₽
                      </Text>
                    </View>
                  )}
                />
              </View>
              <View style={styles.legendContainer}>
                {expensesByCategory.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>
                      {item.category} - {((item.value / totalExpenses) * 100).toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>Нет данных о расходах</Text>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Общая сводка</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Доходы:</Text>
            <Text style={[styles.summaryAmount, styles.positive]}>+{totalIncome} ₽</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Расходы:</Text>
            <Text style={[styles.summaryAmount, styles.negative]}>-{totalExpenses} ₽</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Баланс:</Text>
            <Text style={[styles.summaryAmount, totalIncome - totalExpenses >= 0 ? styles.positive : styles.negative]}>
              {totalIncome - totalExpenses} ₽
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8'
  },
  content: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 24
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  label: {
    fontSize: 16,
    color: Colors.grey_2
  },
  amount: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black
  },
  editContainer: {
    marginTop: 8
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 4
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16
  },
  centerLabel: {
    alignItems: 'center'
  },
  centerLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black
  },
  legendContainer: {
    marginTop: 16
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8
  },
  legendText: {
    fontSize: 14,
    color: Colors.black
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.black
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600'
  },
  positive: {
    color: '#34C759'
  },
  negative: {
    color: '#FF3B30'
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8
  },
  noDataText: {
    textAlign: 'center',
    color: Colors.grey_2,
    marginVertical: 24
  }
});