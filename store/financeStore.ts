import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  category: string;
  price: number;
  color: string;
  type: 'income' | 'expense';
  date: Date;
  description: string;
}

interface FinanceStore {
  transactions: Transaction[];
  monthlyBudget: number;
  currentBalance: number;
  addTransaction: (transaction: Transaction) => void;
  setMonthlyBudget: (amount: number) => void;
  getCurrentBalance: () => number;
  clearAllTransactions: () => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      monthlyBudget: 0,
      currentBalance: 0,
      addTransaction: (transaction) => 
        set((state) => {
          const balanceChange = transaction.type === 'income' ? 
            transaction.price : 
            -transaction.price;
          
          return {
            transactions: [...state.transactions, transaction],
            currentBalance: state.currentBalance + balanceChange
          };
        }),
      setMonthlyBudget: (amount) => 
        set(() => ({ 
          monthlyBudget: amount,
          currentBalance: amount 
        })),
      getCurrentBalance: () => {
        const { transactions, monthlyBudget } = get();
        
        const balance = transactions.reduce((acc, transaction) => {
          if (transaction.type === 'income') {
            return acc + transaction.price;
          } else {
            return acc - transaction.price;
          }
        }, monthlyBudget);

        return balance;
      },
      clearAllTransactions: () => 
        set(() => ({ 
          transactions: [],
          currentBalance: 0 
        })),
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        monthlyBudget: state.monthlyBudget,
        currentBalance: state.currentBalance,
      }),
    }
  )
);