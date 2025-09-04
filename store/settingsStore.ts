import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate?: number;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SettingsStore {
  currency: Currency;
  safetyBufferPercent: number;
  themeMode: ThemeMode;
  setCurrency: (newCurrency: Currency) => void;
  setSafetyBufferPercent: (percent: number) => void;
  setThemeMode: (mode: ThemeMode) => void;
  updateCurrencyRates: (rates: { [key: string]: number }) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      currency: { code: 'RUB', symbol: '₽', name: 'Российский рубль', rate: 1 },
      safetyBufferPercent: 20,
      themeMode: 'system',
      setCurrency: (newCurrency) => set({ currency: newCurrency }),
      setSafetyBufferPercent: (percent) => set({ safetyBufferPercent: percent }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      updateCurrencyRates: (rates) => 
        set((state) => ({
          currency: {
            ...state.currency,
            rate: rates[state.currency.code] || 1
          }
        }))
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 