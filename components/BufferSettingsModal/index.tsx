import React, { forwardRef, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ThemedView from '@/components/ThemedView';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import { useSettingsStore } from '@/store/settingsStore';
import BackdropComponent from '../BackdropComponent';

interface BufferSettingsModalProps {
  handleDismiss: () => void;
}

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
        backdropComponent={BackdropComponent}
        enablePanDownToClose
        index={0}
      >
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Резервный буфер</ThemedText>
          
          <ThemedText type="body" lightColor={Colors.grey_2} style={styles.description}>
            Процент от бюджета, который будет автоматически резервироваться на непредвиденные расходы
          </ThemedText>

          <ThemedView style={styles.sliderContainer}>
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
            <ThemedText type="heading" style={styles.percentageText}>{safetyBufferPercent}%</ThemedText>
          </ThemedView>

          <ThemedView colorName="surfaceSecondary" style={styles.infoContainer}>
            <ThemedText type="body" lightColor={Colors.grey_2} style={styles.infoText}>
              Рекомендуемое значение: 20%{'\n'}
              Минимальное значение: 0%{'\n'}
              Максимальное значение: 50%
            </ThemedText>
          </ThemedView>
        </ThemedView>
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