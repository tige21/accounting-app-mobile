import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, AccessibilityInfo } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import Colors from '@/constants/Colors';
import CommonButton from '@/components/CommonButton';
import styles from './styles';
import BackdropComponent from '../BackdropComponent';

export interface FontSettings {
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
}

interface FontSettingsModalProps {
  initialSettings?: FontSettings;
  onSave: (fontSize: number, fontFamily: string, fontStyle: string) => void;
  handleDismiss: () => void;
}

const FONT_SIZES = [12, 14, 16, 18, 20, 24];
const FONT_FAMILIES = [
  { label: 'System', value: 'System' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Times', value: 'Times New Roman' },
  { label: 'Helvetica', value: 'Helvetica' }
];
const FONT_STYLES = [
  { label: 'Normal', value: 'normal', weight: 'normal' as const },
  { label: 'Bold', value: 'bold', weight: 'bold' as const },
  { label: 'Italic', value: 'italic', weight: 'normal' as const },
  { label: 'Bold Italic', value: 'boldItalic', weight: 'bold' as const }
];

const FontSettingsModal = forwardRef<BottomSheetModal, FontSettingsModalProps>(
  ({ initialSettings, onSave, handleDismiss }, ref) => {
    const [fontSize, setFontSize] = useState(initialSettings?.fontSize || 16);
    const [fontFamily, setFontFamily] = useState(initialSettings?.fontFamily || 'System');
    const [fontStyle, setFontStyle] = useState(initialSettings?.fontStyle || 'normal');

    const snapPoints = useMemo(() => ['75%'], []);

    const handleSave = useCallback(() => {
      onSave(fontSize, fontFamily, fontStyle);
      handleDismiss();
    }, [fontSize, fontFamily, fontStyle, onSave, handleDismiss]);

    const handleCancel = useCallback(() => {
      // Reset to initial settings
      setFontSize(initialSettings?.fontSize || 16);
      setFontFamily(initialSettings?.fontFamily || 'System');
      setFontStyle(initialSettings?.fontStyle || 'normal');
      handleDismiss();
    }, [initialSettings, handleDismiss]);

    const getPreviewTextStyle = useCallback(() => {
      const selectedStyle = FONT_STYLES.find(style => style.value === fontStyle);
      return {
        fontSize,
        fontFamily: fontFamily === 'System' ? undefined : fontFamily,
        fontWeight: selectedStyle?.weight || 'normal',
        fontStyle: (fontStyle === 'italic' || fontStyle === 'boldItalic' ? 'italic' : 'normal') as 'normal' | 'italic',
      };
    }, [fontSize, fontFamily, fontStyle]);

    const renderFontSizeSection = () => (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Size</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={24}
            step={2}
            value={fontSize}
            onValueChange={setFontSize}
            minimumTrackTintColor={Colors.blue}
            maximumTrackTintColor="#E5E5E5"
            thumbTintColor={Colors.blue}
            accessibilityLabel="Font size slider"
            accessibilityHint={`Current font size is ${fontSize}px`}
          />
          <View style={styles.fontSizeLabels}>
            <Text style={styles.fontSizeLabel}>12px</Text>
            <Text style={styles.fontSizeCurrentValue}>{fontSize}px</Text>
            <Text style={styles.fontSizeLabel}>24px</Text>
          </View>
        </View>
      </View>
    );

    const renderFontFamilySection = () => (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Family</Text>
        <View style={styles.optionsContainer}>
          {FONT_FAMILIES.map((family) => (
            <TouchableOpacity
              key={family.value}
              style={[
                styles.optionButton,
                fontFamily === family.value && styles.optionButtonSelected
              ]}
              onPress={() => setFontFamily(family.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: fontFamily === family.value }}
              accessibilityHint={`Select ${family.label} font family`}
            >
              <Text style={[
                styles.optionButtonText,
                fontFamily === family.value && styles.optionButtonTextSelected,
                { fontFamily: family.value === 'System' ? undefined : family.value }
              ]}>
                {family.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );

    const renderFontStyleSection = () => (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Style</Text>
        <View style={styles.optionsContainer}>
          {FONT_STYLES.map((style) => (
            <TouchableOpacity
              key={style.value}
              style={[
                styles.optionButton,
                fontStyle === style.value && styles.optionButtonSelected
              ]}
              onPress={() => setFontStyle(style.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: fontStyle === style.value }}
              accessibilityHint={`Select ${style.label} text style`}
            >
              <Text style={[
                styles.optionButtonText,
                fontStyle === style.value && styles.optionButtonTextSelected,
                {
                  fontWeight: style.weight,
                  fontStyle: (style.value === 'italic' || style.value === 'boldItalic' ? 'italic' : 'normal') as 'normal' | 'italic'
                }
              ]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );

    const renderPreviewSection = () => (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewContainer}>
          <Text 
            style={[styles.previewText, getPreviewTextStyle()]}
            accessibilityLabel="Font preview text"
            accessibilityHint={`Preview showing font size ${fontSize}px, family ${fontFamily}, style ${fontStyle}`}
          >
            The quick brown fox jumps over the lazy dog. 
            This is how your text will look with the selected settings.
          </Text>
        </View>
      </View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={BackdropComponent}
        enablePanDownToClose
        enableDynamicSizing={false}
        accessibilityLabel="Font settings modal"
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Font Settings</Text>
          
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderFontSizeSection()}
            {renderFontFamilySection()}
            {renderFontStyleSection()}
            {renderPreviewSection()}
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <CommonButton 
                placeholder="Cancel" 
                isCancel={true} 
                onPress={handleCancel}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <CommonButton 
                placeholder="Save" 
                onPress={handleSave}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

FontSettingsModal.displayName = 'FontSettingsModal';

export default FontSettingsModal;