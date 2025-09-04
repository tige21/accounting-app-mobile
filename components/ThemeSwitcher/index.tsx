import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSettingsStore, ThemeMode } from '@/store/settingsStore';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useDynamicStyles, useThemeColorValue } from '@/hooks';
import Feather from '@expo/vector-icons/Feather';

interface ThemeSwitcherProps {
  style?: any;
}

const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Светлая', icon: 'sun' },
  { value: 'dark', label: 'Темная', icon: 'moon' },
  { value: 'system', label: 'Системная', icon: 'smartphone' },
];

export default function ThemeSwitcher({ style }: ThemeSwitcherProps) {
  const { themeMode, setThemeMode } = useSettingsStore();
  const borderColor = useThemeColorValue('border');
  const activeColor = useThemeColorValue('primary');

  const styles = useDynamicStyles((colors) => ({
    container: {
      padding: 16,
    },
    title: {
      marginBottom: 16,
    },
    optionsContainer: {
      gap: 8,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      gap: 12,
    },
    optionText: {
      flex: 1,
      fontSize: 16,
    },
  }));

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText type="subtitle" style={styles.title}>
        Тема приложения
      </ThemedText>
      
      <ThemedView style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { borderColor },
              themeMode === option.value && { 
                borderColor: activeColor,
                backgroundColor: activeColor + '20' 
              }
            ]}
            onPress={() => setThemeMode(option.value)}
          >
            <Feather 
              name={option.icon as any}
              size={20}
              color={themeMode === option.value ? activeColor : borderColor}
            />
            <ThemedText 
              style={[
                styles.optionText,
                themeMode === option.value && { color: activeColor }
              ]}
            >
              {option.label}
            </ThemedText>
            {themeMode === option.value && (
              <Feather name="check" size={16} color={activeColor} />
            )}
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
}