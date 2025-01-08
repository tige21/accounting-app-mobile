import { create } from 'zustand';

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

export const useFinanceStore = create<FinanceStore>((set, get) => ({
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
}));