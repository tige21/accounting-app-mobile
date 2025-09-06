import React, { useState } from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import our custom components and hooks
import { 
  AuthButton, 
  TrustBadge,
  ThemedText, 
  ThemedView 
} from '@/components';
import { 
  useOAuth, 
  useResponsiveLayout,
  useThemeContext 
} from '@/hooks';

const AuthScreen = () => {
  const router = useRouter();
  const { isDark } = useThemeContext();
  const { containerPadding, buttonHeight, titleFontSize, bodyFontSize } = useResponsiveLayout();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  
  const {
    isLoading,
    error,
    signInWithGoogle,
    signInWithGitHub,
    isAuthenticated
  } = useOAuth();

  // Redirect if authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Authentication Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleGitHubAuth = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      Alert.alert('Authentication Error', 'Failed to sign in with GitHub. Please try again.');
    }
  };

  const handleGuestContinue = () => {
    Alert.alert(
      'Guest Mode',
      'You can use WalletWatch without an account, but your data will only be stored locally on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.replace('/(tabs)') }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedView colorName="background" className="flex-1">
        {/* Header */}
        <View 
          className="flex-row items-center justify-between py-4 border-b border-neutral-200"
          style={{ paddingHorizontal: containerPadding }}
        >
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#007AFF'} />
          </Pressable>
          
          <ThemedText className="text-lg font-semibold">
            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
          </ThemedText>
          
          <View className="w-10" />
        </View>

        <ScrollView 
          className="flex-1"
          style={{ paddingHorizontal: containerPadding }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Main Content */}
          <View className="flex-1 justify-center py-8">
            {/* App Branding */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-4 shadow-lg">
                <ThemedText className="text-white text-2xl font-bold">W</ThemedText>
              </View>
              <ThemedText 
                className="font-bold text-center mb-2"
                style={{ fontSize: titleFontSize }}
              >
                {authMode === 'signin' ? 'Welcome back!' : 'Join WalletWatch'}
              </ThemedText>
              <ThemedText 
                className="text-text-secondary text-center leading-relaxed"
                style={{ fontSize: bodyFontSize }}
              >
                {authMode === 'signin' 
                  ? 'Sign in to access your financial data across all devices'
                  : 'Create your account to start tracking your finances securely'
                }
              </ThemedText>
            </View>

            {/* Error Display */}
            {error && (
              <View className="bg-error-background border border-error p-4 rounded-xl mb-6">
                <View className="flex-row items-center">
                  <Ionicons name="warning" size={20} color="#FF4444" />
                  <ThemedText className="ml-2 text-error font-medium">
                    Authentication Failed
                  </ThemedText>
                </View>
                <ThemedText className="text-sm text-error mt-1">
                  {error}
                </ThemedText>
              </View>
            )}

            {/* OAuth Buttons */}
            <View className="space-y-4 mb-8">
              <OAuthProviderButton
                provider="google"
                title={`${authMode === 'signin' ? 'Sign in' : 'Continue'} with Google`}
                onPress={handleGoogleAuth}
                isLoading={isLoading}
                buttonHeight={buttonHeight}
              />
              
              <OAuthProviderButton
                provider="github"
                title={`${authMode === 'signin' ? 'Sign in' : 'Continue'} with GitHub`}
                onPress={handleGitHubAuth}
                isLoading={isLoading}
                buttonHeight={buttonHeight}
              />
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-px bg-neutral-200" />
              <ThemedText className="px-4 text-sm text-text-secondary">OR</ThemedText>
              <View className="flex-1 h-px bg-neutral-200" />
            </View>

            {/* Guest Option */}
            <Pressable
              onPress={handleGuestContinue}
              className="py-4 items-center border-2 border-neutral-200 rounded-xl mb-8 active:bg-neutral-50"
              style={{ height: buttonHeight }}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue without an account"
            >
              <ThemedText className="text-base font-medium text-text-secondary">
                Continue as Guest
              </ThemedText>
              <ThemedText className="text-xs text-text-secondary mt-1">
                Limited features, data stored locally only
              </ThemedText>
            </Pressable>

            {/* Auth Mode Toggle */}
            <View className="flex-row justify-center mb-8">
              <ThemedText className="text-sm text-text-secondary">
                {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              </ThemedText>
              <Pressable onPress={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}>
                <ThemedText className="text-sm text-primary font-medium">
                  {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                </ThemedText>
              </Pressable>
            </View>

            {/* Security Note */}
            <View className="bg-surface p-4 rounded-xl mb-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="shield-checkmark" size={20} color="#00B4D8" />
                <ThemedText className="ml-2 text-sm font-semibold">
                  Your data is secure
                </ThemedText>
              </View>
              
              {/* Trust Indicators */}
              <View className="flex-row justify-around mb-4">
                <TrustBadge
                  icon="lock-closed"
                  title="Encrypted"
                  subtitle="End-to-end encryption"
                  size="small"
                />
                <TrustBadge
                  icon="shield-checkmark"
                  title="Private"
                  subtitle="Never sold or shared"
                  size="small"
                />
                <TrustBadge
                  icon="server"
                  title="Backed up"
                  subtitle="Secure cloud storage"
                  size="small"
                />
              </View>
              
              <ThemedText className="text-xs text-text-secondary leading-relaxed">
                We use industry-standard encryption and never share your personal financial data with third parties. 
                Your privacy and security are our top priorities.
              </ThemedText>
            </View>
          </View>

          {/* Legal Footer */}
          <View className="items-center py-6 border-t border-neutral-200">
            <ThemedText className="text-xs text-text-secondary text-center mb-3">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </ThemedText>
            <View className="flex-row space-x-6">
              <Pressable onPress={() => {}} accessibilityRole="button">
                <ThemedText className="text-xs text-primary underline">
                  Privacy Policy
                </ThemedText>
              </Pressable>
              <Pressable onPress={() => {}} accessibilityRole="button">
                <ThemedText className="text-xs text-primary underline">
                  Terms of Service
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
};

// OAuth Provider Button Component
interface OAuthProviderButtonProps {
  provider: 'google' | 'github';
  title: string;
  onPress: () => void;
  isLoading: boolean;
  buttonHeight: number;
}

const OAuthProviderButton: React.FC<OAuthProviderButtonProps> = ({
  provider,
  title,
  onPress,
  isLoading,
  buttonHeight
}) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          backgroundColor: '#FFFFFF',
          borderColor: '#DADCE0',
          textColor: '#3C4043',
          icon: 'logo-google' as keyof typeof Ionicons.glyphMap,
          iconColor: '#4285F4'
        };
      case 'github':
        return {
          backgroundColor: '#24292F',
          borderColor: '#24292F',
          textColor: '#FFFFFF',
          icon: 'logo-github' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FFFFFF'
        };
      default:
        return {
          backgroundColor: '#FFFFFF',
          borderColor: '#DADCE0',
          textColor: '#3C4043',
          icon: 'logo-google' as keyof typeof Ionicons.glyphMap,
          iconColor: '#4285F4'
        };
    }
  };

  const config = getProviderConfig();

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={`
        flex-row items-center justify-center px-4 rounded-xl border-2
        active:scale-95 transition-transform
        ${isLoading ? 'opacity-50' : ''}
      `}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        height: buttonHeight
      }}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ busy: isLoading, disabled: isLoading }}
    >
      <Ionicons 
        name={config.icon} 
        size={20} 
        color={config.iconColor} 
        style={{ marginRight: 12 }}
      />
      
      <ThemedText 
        className="text-base font-semibold"
        style={{ color: config.textColor }}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
};

export default AuthScreen;