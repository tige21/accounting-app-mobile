import { useMemo } from 'react';
import { useTransactionStore, Transaction } from './transactionStore';

export const useTransactionSelectors = () => {
  const transactions = useTransactionStore(state => state.transactions);
  
  // Мемоизированные общие расчеты
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.price, 0);
  }, [transactions]);
  
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.price, 0);
  }, [transactions]);

  // Мемоизированная функция для получения транзакций по месяцам
  const getMonthlyTransactions = useMemo(() => {
    return (month: number, year: number) => {
      return transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    };
  }, [transactions]);

  // Мемоизированная функция для получения месячных доходов
  const getMonthlyIncome = useMemo(() => {
    return (month: number, year: number) => {
      return transactions
        .filter(t => {
          const date = new Date(t.date);
          return t.type === 'income' && 
                 date.getMonth() === month && 
                 date.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.price, 0);
    };
  }, [transactions]);

  // Мемоизированная функция для получения месячных расходов
  const getMonthlyExpenses = useMemo(() => {
    return (month: number, year: number) => {
      return transactions
        .filter(t => {
          const date = new Date(t.date);
          return t.type === 'expense' && 
                 date.getMonth() === month && 
                 date.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.price, 0);
    };
  }, [transactions]);

  // Мемоизированные данные по категориям
  const categorizedData = useMemo(() => {
    const categories = new Map();
    
    transactions.forEach(transaction => {
      const key = transaction.category;
      const existing = categories.get(key) || { 
        category: transaction.category, 
        color: transaction.color, 
        income: 0, 
        expense: 0 
      };
      
      if (transaction.type === 'income') {
        existing.income += transaction.price;
      } else {
        existing.expense += transaction.price;
      }
      
      categories.set(key, existing);
    });
    
    return Array.from(categories.values());
  }, [transactions]);

  // Мемоизированная статистика за последние 30 дней
  const last30DaysStats = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTransactions = transactions.filter(t => 
      new Date(t.date) >= thirtyDaysAgo
    );
    
    const income = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.price, 0);
      
    const expenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.price, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: recentTransactions.length
    };
  }, [transactions]);

  return {
    totalExpenses,
    totalIncome,
    getMonthlyTransactions,
    getMonthlyIncome,
    getMonthlyExpenses,
    categorizedData,
    last30DaysStats
  };
};