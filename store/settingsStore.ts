import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const AVAILABLE_CURRENCIES: Currency[] = [
  { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
];

export interface SettingsStore {
  currency: Currency;
  safetyBufferPercent: number; // Процент резервного буфера
  setCurrency: (currency: Currency) => void;
  setSafetyBufferPercent: (percent: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      currency: AVAILABLE_CURRENCIES[0],
      safetyBufferPercent: 20, // По умолчанию 20%
      setCurrency: (currency) => set({ currency }),
      setSafetyBufferPercent: (percent) => set({ safetyBufferPercent: percent }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 