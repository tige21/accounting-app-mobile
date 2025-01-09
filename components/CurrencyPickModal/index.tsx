import React, { forwardRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { Currency, AVAILABLE_CURRENCIES, useSettingsStore } from '@/store/settingsStore';

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

    const handleSelect = (currency: Currency) => {
      setCurrency(currency);
      handleDismiss();
    };

    const renderContent = () => (
      <View style={styles.container}>
        <Text style={styles.title}>Выберите валюту</Text>
        {AVAILABLE_CURRENCIES.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            style={[
              styles.currencyItem,
              currency.code === selectedCurrency.code && styles.selectedItem,
            ]}
            onPress={() => handleSelect(currency)}
          >
            <Text style={[
              styles.currencyText,
              currency.code === selectedCurrency.code && styles.selectedText,
            ]}>
              {currency.name} ({currency.symbol})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={renderBackdrop()}
        enablePanDownToClose
        index={0}
      >
        <BottomSheetScrollView >
          {renderContent()}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.black,
  },
  currencyItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  selectedItem: {
    backgroundColor: Colors.blue,
  },
  currencyText: {
    fontSize: 16,
    color: Colors.black,
  },
  selectedText: {
    color: 'white',
  },
});

export default CurrencyPickModal;