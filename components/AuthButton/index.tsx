import React from 'react';
import { Pressable, ActivityIndicator, View } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeProvider';
import ThemedText from '@/components/ThemedText';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon,
  className = '',
}) => {
  const { isDark } = useThemeContext();

  const getButtonStyles = () => {
    const baseStyle = "flex-row items-center justify-center px-6 py-4 rounded-xl active:scale-95 transition-all duration-150";
    
    switch (variant) {
      case 'primary':
        return `${baseStyle} bg-primary ${disabled || isLoading ? 'opacity-50' : ''}`;
      case 'secondary':
        return `${baseStyle} bg-secondary ${disabled || isLoading ? 'opacity-50' : ''}`;
      case 'outline':
        return `${baseStyle} border-2 border-primary bg-transparent ${disabled || isLoading ? 'opacity-50' : ''}`;
      default:
        return `${baseStyle} bg-primary ${disabled || isLoading ? 'opacity-50' : ''}`;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return "text-white text-base font-semibold";
      case 'secondary':
        return "text-white text-base font-semibold";
      case 'outline':
        return "text-primary text-base font-semibold";
      default:
        return "text-white text-base font-semibold";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`${getButtonStyles()} ${className}`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ 
        busy: isLoading, 
        disabled: disabled || isLoading 
      }}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#007AFF' : '#FFFFFF'} 
          className="mr-2"
        />
      ) : (
        icon && <View className="mr-2">{icon}</View>
      )}
      
      <ThemedText className={getTextStyles()}>
        {isLoading ? 'Loading...' : title}
      </ThemedText>
    </Pressable>
  );
};

export default AuthButton;