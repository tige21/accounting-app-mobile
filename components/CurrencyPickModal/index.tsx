import React, { forwardRef, useCallback, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { Currency, useSettingsStore } from '@/store/settingsStore';
import { useCurrencyRates } from '@/features/hooks/useCurrencyRates';
import { Ionicons } from '@expo/vector-icons';

interface CurrencyPickModalProps {
  handleDismiss: () => void;
}

const renderBackdrop = () =>
  useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );

const CurrencyPickModal = forwardRef<BottomSheetModal, CurrencyPickModalProps>(
  ({ handleDismiss }, ref) => {
    const { currency: selectedCurrency, setCurrency } = useSettingsStore();
    const { data: ratesData, isLoading } = useCurrencyRates();
    const [searchQuery, setSearchQuery] = useState('');

    // Преобразуем данные с сервера в массив валют
    const availableCurrencies = useMemo(() => {
      if (!ratesData) return [];

      // Добавляем рубль как базовую валюту
      const currencies: Currency[] = [{
        code: 'RUB',
        symbol: '₽',
        name: 'Российский рубль',
        rate: 1
      }];

      // Добавляем остальные валюты из API
      Object.entries(ratesData.Valute).forEach(([code, data]) => {
        currencies.push({
          code,
          symbol: getSymbolForCurrency(code),
          name: data.Name,
          rate: data.Value
        });
      });

      return currencies;
    }, [ratesData]);

    // Фильтруем валюты по поисковому запросу
    const filteredCurrencies = useMemo(() => {
      if (!searchQuery) return availableCurrencies;

      const query = searchQuery.toLowerCase();
      return availableCurrencies.filter(
        currency => 
          currency.name.toLowerCase().includes(query) ||
          currency.code.toLowerCase().includes(query)
      );
    }, [availableCurrencies, searchQuery]);

    const handleCurrencySelect = (newCurrency: Currency) => {
      setCurrency(newCurrency);
      handleDismiss();
    };

    // Функция для получения символа валюты
    function getSymbolForCurrency(code: string): string {
      const symbols: { [key: string]: string } = {
        'RUB': '₽',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CNY': '¥',
        'AUD': 'A$',
        'AZN': '₼',
        'AMD': '֏',
        'BYN': 'Br',
        'BGN': 'лв',
        'BRL': 'R$',
        'HUF': 'Ft',
        'VND': '₫',
        'HKD': 'HK$',
        'GEL': '₾',
        'DKK': 'kr',
        'AED': 'د.إ',
        'EGP': 'E£',
        'INR': '₹',
        'IDR': 'Rp',
        'KZT': '₸',
        'CAD': 'C$',
        'QAR': 'ر.ق',
        'KGS': 'с',
        'MDL': 'L',
        'NZD': 'NZ$',
        'NOK': 'kr',
        'PLN': 'zł',
        'RON': 'lei',
        'XDR': 'SDR',
        'SGD': 'S$',
        'TJS': 'ЅM',
        'THB': '฿',
        'TRY': '₺',
        'TMT': 'T',
        'UZS': 'so',
        'UAH': '₴',
        'CZK': 'Kč',
        'SEK': 'kr',
        'CHF': 'Fr',
        'RSD': 'дин',
        'ZAR': 'R',
        'KRW': '₩'
      };
      
      // Возвращаем символ валюты или код валюты, если символ не найден
      return symbols[code] || code;
    }

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['80%', '90%']}
        backdropComponent={renderBackdrop()}
        enablePanDownToClose
        index={0}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Выберите валюту</Text>
          
          {/* Поисковая строка */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.grey_2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск валюты"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.grey_2}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={Colors.grey_2} />
              </TouchableOpacity>
            ) : null}
          </View>

          {isLoading ? (
            <ActivityIndicator style={styles.loader} color={Colors.blue} />
          ) : (
            <BottomSheetScrollView>
              {filteredCurrencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    currency.code === selectedCurrency.code && styles.selectedItem,
                  ]}
                  onPress={() => handleCurrencySelect(currency)}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={[
                      styles.currencyText,
                      currency.code === selectedCurrency.code && styles.selectedText,
                    ]}>
                      {currency.name}
                    </Text>
                    <Text style={[
                      styles.currencySubtext,
                      currency.code === selectedCurrency.code && styles.selectedText,
                    ]}>
                      {currency.code} • {currency.symbol}
                    </Text>
                  </View>
                  {currency.code === selectedCurrency.code && (
                    <Ionicons name="checkmark" size={24} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </BottomSheetScrollView>
          )}
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.black
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey_6,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: Colors.black
  },
  loader: {
    marginTop: 20
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.grey_6
  },
  selectedItem: {
    backgroundColor: Colors.blue
  },
  currencyInfo: {
    flex: 1
  },
  currencyText: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 4
  },
  currencySubtext: {
    fontSize: 14,
    color: Colors.grey_2
  },
  selectedText: {
    color: 'white'
  }
});

CurrencyPickModal.displayName = 'CurrencyPickModal';

export default CurrencyPickModal;