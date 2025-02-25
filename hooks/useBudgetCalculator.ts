import { useTransactionStore } from '@/store/transactionStore';
import { useFinanceStore } from '@/store/financeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useCurrencyRates } from '@/features/hooks/useCurrencyRates';
import dayjs from 'dayjs';

interface BudgetStats {
  dailyLimit: number;
  remainingDays: number;
  totalBalance: number;
  safetyBuffer: number;
  todaySpent: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  daysWithZeroBudget: number;
  debt: number;
}

export const useBudgetCalculator = () => {
  const { transactions } = useTransactionStore();
  const { monthlyBudget } = useFinanceStore();
  const { safetyBufferPercent, currency } = useSettingsStore();
  const { data: ratesData } = useCurrencyRates();

  const convertAmount = (amount: number): number => {
    if (!ratesData || !currency) return amount;
    
    if (currency.code === 'RUB') return amount;
    
    const rate = ratesData.Valute[currency.code]?.Value || 1;
    return amount / rate;
  };

  const calculateBudgetStats = (date: dayjs.Dayjs): BudgetStats => {
    const currentMonth = date.month();
    const currentYear = date.year();
    
    // Конвертируем все транзакции в выбранную валюту
    const convertedTransactions = transactions.map(t => ({
      ...t,
      price: convertAmount(t.price)
    }));

    // Конвертируем месячный бюджет
    const convertedMonthlyBudget = convertAmount(monthlyBudget);
    
    const monthTransactions = convertedTransactions.filter(t => {
      const transactionDate = dayjs(t.date);
      return transactionDate.month() === currentMonth && 
             transactionDate.year() === currentYear;
    });

    const monthlyIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.price, 0) + convertedMonthlyBudget;

    const monthlyExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.price, 0);

    const totalBalance = monthlyIncome - monthlyExpenses;
    const safetyBuffer = monthlyIncome * (safetyBufferPercent / 100);
    const availableTotal = totalBalance - safetyBuffer;

    const daysInMonth = date.daysInMonth();
    const baseDailyBudget = availableTotal / daysInMonth;

    let accumulatedDebt = 0;
    let daysWithZeroBudget = 0;

    for (let i = 1; i <= date.date(); i++) {
      const checkDate = date.startOf('month').add(i - 1, 'day');
      const dayExpenses = monthTransactions
        .filter(t => 
          t.type === 'expense' && 
          dayjs(t.date).isSame(checkDate, 'day')
        )
        .reduce((sum, t) => sum + t.price, 0);

      if (dayExpenses > baseDailyBudget) {
        const dayDebt = dayExpenses - baseDailyBudget;
        accumulatedDebt += dayDebt;

        const daysNeededToCoverDebt = Math.ceil(dayDebt / baseDailyBudget);
        if (checkDate.isBefore(date, 'day')) {
          daysWithZeroBudget = Math.max(
            daysWithZeroBudget,
            daysNeededToCoverDebt - date.diff(checkDate, 'day')
          );
        }
      }
    }

    let dailyLimit = baseDailyBudget;
    const todaySpent = monthTransactions
      .filter(t => 
        t.type === 'expense' && 
        dayjs(t.date).isSame(date, 'day')
      )
      .reduce((sum, t) => sum + t.price, 0);

    if (daysWithZeroBudget > 0) {
      dailyLimit = 0;
    } else {
      dailyLimit = Math.max(0, dailyLimit - todaySpent);
    }

    return {
      dailyLimit,
      remainingDays: date.endOf('month').diff(date, 'day') + 1,
      totalBalance,
      safetyBuffer,
      todaySpent,
      monthlyIncome,
      monthlyExpenses,
      daysWithZeroBudget,
      debt: accumulatedDebt
    };
  };

  return { calculateBudgetStats };
}; 