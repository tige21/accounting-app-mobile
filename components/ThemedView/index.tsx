import { View, type ViewProps } from 'react-native';

import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: 'background' | 'surface' | 'surfaceSecondary' | 'surfaceElevated' | 'backgroundSecondary' | 'backgroundTertiary' | 'card' | 'cardElevated' | 'inputBackground' | 'tabBar' | 'transparent';
};

export default function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  colorName = 'background',
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
