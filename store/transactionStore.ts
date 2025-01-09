import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  category: string;
  price: number;
  color: string;
  type: 'income' | 'expense';
  date: Date;
  description: string;
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getTotalExpenses: () => number;
  getTotalIncome: () => number;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (transaction) => 
        set((state) => ({
          transactions: [...state.transactions, { ...transaction, id: Date.now().toString() }]
        })),
      
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        })),
      
      updateTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedTransaction } : t
          )
        })),
      
      getTransactionsByMonth: (month: number, year: number) => {
        const { transactions } = get();
        return transactions.filter((t) => {
          const date = new Date(t.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });
      },
      
      getTotalExpenses: () => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.price, 0);
      },
      
      getTotalIncome: () => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.price, 0);
      },

      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 