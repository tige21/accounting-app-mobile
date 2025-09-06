import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useThemeContext } from '@/contexts/ThemeProvider';

interface TrustBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  size?: 'small' | 'medium' | 'large';
}

const TrustBadge: React.FC<TrustBadgeProps> = ({
  icon,
  title,
  subtitle,
  size = 'medium'
}) => {
  const { isDark } = useThemeContext();

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-20',
          iconSize: 20,
          iconContainer: 'w-8 h-8',
          titleSize: 'text-sm',
          subtitleSize: 'text-xs'
        };
      case 'medium':
        return {
          container: 'w-24',
          iconSize: 24,
          iconContainer: 'w-10 h-10',
          titleSize: 'text-sm',
          subtitleSize: 'text-xs'
        };
      case 'large':
        return {
          container: 'w-28',
          iconSize: 28,
          iconContainer: 'w-12 h-12',
          titleSize: 'text-base',
          subtitleSize: 'text-sm'
        };
      default:
        return {
          container: 'w-24',
          iconSize: 24,
          iconContainer: 'w-10 h-10',
          titleSize: 'text-sm',
          subtitleSize: 'text-xs'
        };
    }
  };

  const config = getSizeConfig();

  return (
    <View className={`${config.container} items-center`}>
      {/* Icon Container */}
      <ThemedView 
        colorName="surface"
        className={`${config.iconContainer} rounded-full items-center justify-center mb-2 shadow-sm`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Ionicons 
          name={icon} 
          size={config.iconSize} 
          color="#00B4D8" 
        />
      </ThemedView>
      
      {/* Text Content */}
      <ThemedText className={`${config.titleSize} font-semibold text-center mb-1`}>
        {title}
      </ThemedText>
      
      <ThemedText 
        className={`${config.subtitleSize} text-text-secondary text-center leading-tight`}
      >
        {subtitle}
      </ThemedText>
    </View>
  );
};

export default TrustBadge;