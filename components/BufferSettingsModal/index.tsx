import React, { forwardRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import Colors from '@/constants/Colors';
import { useSettingsStore } from '@/store/settingsStore';

interface BufferSettingsModalProps {
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

const BufferSettingsModal = forwardRef<BottomSheetModal, BufferSettingsModalProps>(
  ({ handleDismiss }, ref) => {
    const { safetyBufferPercent, setSafetyBufferPercent } = useSettingsStore();

    const handleChange = (value: number) => {
      setSafetyBufferPercent(Math.round(value));
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['50%']}
        backdropComponent={renderBackdrop()}
        enablePanDownToClose
        index={0}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Резервный буфер</Text>
          
          <Text style={styles.description}>
            Процент от бюджета, который будет автоматически резервироваться на непредвиденные расходы
          </Text>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={50}
              step={5}
              value={safetyBufferPercent}
              onValueChange={handleChange}
              minimumTrackTintColor={Colors.blue}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={Colors.blue}
            />
            <Text style={styles.percentageText}>{safetyBufferPercent}%</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Рекомендуемое значение: 20%{'\n'}
              Минимальное значение: 0%{'\n'}
              Максимальное значение: 50%
            </Text>
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.black,
  },
  description: {
    fontSize: 14,
    color: Colors.grey_2,
    marginBottom: 24,
    lineHeight: 20,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
    marginTop: 8,
  },
  infoContainer: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.grey_2,
    lineHeight: 20,
  },
});

export default BufferSettingsModal; 