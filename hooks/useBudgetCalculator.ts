import { useTransactionStore } from '@/store/transactionStore';
import { useFinanceStore } from '@/store/financeStore';
import { useSettingsStore } from '@/store/settingsStore';
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
  const { safetyBufferPercent } = useSettingsStore();

  const calculateBudgetStats = (date: dayjs.Dayjs): BudgetStats => {
    const currentMonth = date.month();
    const currentYear = date.year();
    
    // 1. Получаем все транзакции текущего месяца
    const monthTransactions = transactions.filter(t => {
      const transactionDate = dayjs(t.date);
      return transactionDate.month() === currentMonth && 
             transactionDate.year() === currentYear;
    });

    // 2. Базовые расчеты
    const monthlyIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.price, 0) + monthlyBudget;

    const monthlyExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.price, 0);

    const totalBalance = monthlyIncome - monthlyExpenses;
    const safetyBuffer = totalBalance * (safetyBufferPercent / 100);
    const availableTotal = totalBalance - safetyBuffer;

    // 3. Рассчитываем базовый дневной бюджет
    const daysInMonth = date.daysInMonth();
    const baseDailyBudget = availableTotal / daysInMonth;

    // 4. Считаем накопленный долг от перерасходов
    let accumulatedDebt = 0;
    let daysWithZeroBudget = 0;

    // Проходим по всем прошедшим дням месяца до текущей даты
    for (let i = 1; i <= date.date(); i++) {
      const checkDate = date.startOf('month').add(i - 1, 'day');
      const dayExpenses = monthTransactions
        .filter(t => 
          t.type === 'expense' && 
          dayjs(t.date).isSame(checkDate, 'day')
        )
        .reduce((sum, t) => sum + t.price, 0);

      // Если потратили больше дневного бюджета
      if (dayExpenses > baseDailyBudget) {
        const dayDebt = dayExpenses - baseDailyBudget;
        accumulatedDebt += dayDebt;

        // Считаем, на сколько дней вперед растянется долг
        const daysNeededToCoverDebt = Math.ceil(dayDebt / baseDailyBudget);
        if (checkDate.isBefore(date, 'day')) {
          daysWithZeroBudget = Math.max(
            daysWithZeroBudget,
            daysNeededToCoverDebt - date.diff(checkDate, 'day')
          );
        }
      }
    }

    // 5. Рассчитываем доступный бюджет на сегодня
    let dailyLimit = baseDailyBudget;
    const todaySpent = monthTransactions
      .filter(t => 
        t.type === 'expense' && 
        dayjs(t.date).isSame(date, 'day')
      )
      .reduce((sum, t) => sum + t.price, 0);

    // Если есть долг и мы в периоде погашения
    if (daysWithZeroBudget > 0) {
      dailyLimit = 0;
    } else {
      // Вычитаем сегодняшние траты
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