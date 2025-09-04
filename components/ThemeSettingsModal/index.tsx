import React, { forwardRef, useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import CommonButton from '@/components/CommonButton';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import BackdropComponent from '@/components/BackdropComponent';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useDynamicStyles } from '@/hooks/useDynamicStyles';

interface ThemeSettingsModalProps {
  handleDismiss: () => void;
}

const ThemeSettingsModal = forwardRef<BottomSheetModal, ThemeSettingsModalProps>(
  ({ handleDismiss }, ref) => {
    const snapPoints = useMemo(() => ['50%'], []);

    const handleClose = useCallback(() => {
      handleDismiss();
    }, [handleDismiss]);

    const styles = useDynamicStyles((colors) => ({
      container: {
        flex: 1,
        backgroundColor: colors.surface,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
      },
      headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      headerIcon: {
        marginRight: 12,
      },
      title: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
      },
      closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.surfaceSecondary,
      },
      divider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 20,
      },
      content: {
        flex: 1,
        paddingTop: 8,
      },
      themeSwitcher: {
        paddingHorizontal: 4,
      },
      infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
        backgroundColor: colors.primary + '20',
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
      },
      infoIcon: {
        marginRight: 12,
        marginTop: 1,
      },
      infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
      },
      footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 16,
      },
      buttonWrapper: {
        marginHorizontal: 0,
      },
    }));

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={BackdropComponent}
        enablePanDownToClose
        enableDynamicSizing={false}
        accessibilityLabel="Theme settings modal"
        backgroundStyle={{ backgroundColor: styles.container.backgroundColor }}
      >
        <BottomSheetView style={styles.container}>
          {/* Header */}
          <ThemedView colorName="surface" style={styles.header}>
            <ThemedView colorName="surface" style={styles.headerContent}>
              <Ionicons 
                name="color-palette-outline" 
                size={24} 
                color={Colors.blue} 
                style={styles.headerIcon}
              />
              <ThemedText type="heading" style={styles.title}>Настройки темы</ThemedText>
            </ThemedView>
            <TouchableOpacity 
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Закрыть модальное окно"
            >
              <Ionicons name="close" size={24} color={Colors.grey_2} />
            </TouchableOpacity>
          </ThemedView>

          {/* Divider */}
          <ThemedView colorName="surface" style={styles.divider} />
          
          {/* Theme Switcher */}
          <ThemedView colorName="surface" style={styles.content}>
            <ThemeSwitcher style={styles.themeSwitcher} />
            
            {/* Info Section */}
            <ThemedView colorName="surface" style={styles.infoContainer}>
              <Ionicons 
                name="information-circle-outline" 
                size={20} 
                color={Colors.blue_1} 
                style={styles.infoIcon}
              />
              <ThemedText type="secondary" style={styles.infoText}>
                Выберите предпочитаемую тему оформления. Системная тема автоматически подстраивается под настройки устройства.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Footer */}
          <ThemedView colorName="surface" style={styles.footer}>
            <ThemedView colorName="surface" style={styles.buttonWrapper}>
              <CommonButton 
                placeholder="Готово" 
                onPress={handleClose}
              />
            </ThemedView>
          </ThemedView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

ThemeSettingsModal.displayName = 'ThemeSettingsModal';

export default ThemeSettingsModal;