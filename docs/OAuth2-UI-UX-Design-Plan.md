# WalletWatch OAuth2 Authentication UI/UX Design Plan

## Overview
This document outlines a comprehensive UI/UX design system for OAuth2 authentication screens in the WalletWatch React Native mobile application. The design emphasizes trust, security, and seamless user experience while maintaining consistency with the existing financial app aesthetic.

## Design Philosophy

**Core Principles:**
- **Trust-First Design**: Visual elements that convey security and reliability
- **Frictionless Flow**: Minimal steps between user intent and authentication
- **Financial App Aesthetics**: Professional, clean, trustworthy appearance
- **Accessibility**: WCAG 2.1 AA compliance built-in
- **Platform Native Feel**: iOS/Android specific optimizations

---

## Design System Foundation

### Enhanced Color Palette

Building on existing WalletWatch colors with OAuth-specific additions:

```typescript
// OAuth-specific color extensions
const OAuthColors = {
  light: {
    // Existing WalletWatch colors
    primary: '#007AFF',
    secondary: '#34C759', 
    background: '#FFFFFF',
    surface: '#F8F9FA',
    
    // OAuth brand colors
    google: {
      primary: '#4285F4',
      hover: '#3367D6',
      surface: '#F8F9FF',
      border: '#E3F2FD'
    },
    github: {
      primary: '#24292F',
      hover: '#1B1F23',
      surface: '#F6F8FA',
      border: '#E1E4E8'
    },
    
    // Trust & security colors
    success: '#00C851',        // Verification success
    warning: '#FF8800',        // Caution states
    error: '#FF4444',          // Error states
    trust: '#00B4D8',          // Security indicators
    
    // Neutral enhancements
    neutral: {
      50: '#FAFBFC',
      100: '#F5F7FA',
      200: '#E4E7EB',
      300: '#CBD2D9',
      400: '#9AA5B1',
      500: '#7B8794',
      600: '#616E7C',
      700: '#52606D',
      800: '#3E4C59',
      900: '#323F4B'
    }
  },
  dark: {
    // Dark mode adaptations
    primary: '#0A84FF',
    secondary: '#30D158',
    background: '#000000',
    surface: '#1C1C1E',
    
    google: {
      primary: '#4285F4',
      hover: '#5294F7',
      surface: '#0D1B2A',
      border: '#1E3A5F'
    },
    github: {
      primary: '#F0F6FF',
      hover: '#C9D1D9',
      surface: '#0D1117',
      border: '#30363D'
    },
    
    // Trust colors for dark mode
    success: '#00E676',
    warning: '#FFB74D',
    error: '#FF5252',
    trust: '#29B6F6',
    
    // Dark neutral palette
    neutral: {
      50: '#0A0A0B',
      100: '#161618',
      200: '#1C1C1E',
      300: '#2C2C2E',
      400: '#3A3A3C',
      500: '#48484A',
      600: '#636366',
      700: '#8E8E93',
      800: '#AEAEB2',
      900: '#C7C7CC'
    }
  }
}
```

### Typography Hierarchy

```typescript
const AuthTypography = {
  // Display text for hero sections
  hero: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  
  // Page titles
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
    letterSpacing: -0.3
  },
  
  // Section headers
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600'
  },
  
  // Body text
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400'
  },
  
  // Secondary text
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400'
  },
  
  // Button labels
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600'
  },
  
  // Small legal text
  legal: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400'
  }
}
```

### Animation Specifications

```typescript
const AuthAnimations = {
  // Page transitions
  pageTransition: {
    type: 'timing',
    duration: 300,
    easing: 'ease-out'
  },
  
  // Button interactions
  buttonPress: {
    scale: 0.96,
    duration: 100
  },
  
  // Loading states
  pulse: {
    duration: 1000,
    easing: 'ease-in-out',
    repeat: -1,
    repeatReverse: true
  },
  
  // Success animations
  checkmark: {
    duration: 400,
    easing: 'ease-out'
  },
  
  // Error shake
  shake: {
    translateX: [-10, 10, -5, 5, 0],
    duration: 400
  }
}
```

---

## Screen Designs

### 1. Welcome/Landing Screen

**Purpose:** First impression that establishes trust and communicates value

**Layout Structure:**
```
┌─────────────────────────┐
│        Status Bar       │
├─────────────────────────┤
│                         │
│    App Logo + Brand     │
│                         │ 
│    Hero Message         │
│    Value Proposition    │
│                         │
│    [Trust Indicators]   │
│                         │
│    [Get Started CTA]    │
│    [Sign In Link]       │
│                         │ 
│    Legal Links          │
└─────────────────────────┘
```

**Component Implementation:**

```tsx
import React from 'react';
import { View, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '@/contexts/ThemeProvider';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

const WelcomeScreen = ({ navigation }) => {
  const { isDark } = useThemeContext();
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ThemedView colorName="background" className="flex-1">
        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="flex-1 justify-center py-12"
          >
            {/* App Branding */}
            <View className="items-center mb-12">
              <View className="w-24 h-24 bg-primary rounded-2xl items-center justify-center mb-6">
                <ThemedText className="text-white text-3xl font-bold">W</ThemedText>
              </View>
              <ThemedText className="text-3xl font-bold text-center mb-2">
                WalletWatch
              </ThemedText>
              <ThemedText className="text-base text-secondary text-center">
                Your Personal Finance Companion
              </ThemedText>
            </View>

            {/* Value Proposition */}
            <View className="mb-12">
              <ThemedText className="text-xl font-semibold text-center mb-4">
                Take Control of Your Finances
              </ThemedText>
              <ThemedText className="text-base text-text-secondary text-center leading-relaxed">
                Track expenses, manage tasks, and achieve your financial goals 
                with secure cloud synchronization across all your devices.
              </ThemedText>
            </View>

            {/* Trust Indicators */}
            <View className="flex-row justify-around mb-12 px-4">
              <TrustBadge 
                icon="shield-check"
                title="Secure"
                subtitle="Bank-level security"
              />
              <TrustBadge 
                icon="cloud-sync"
                title="Sync"
                subtitle="Cross-device sync"
              />
              <TrustBadge 
                icon="lock"
                title="Private"
                subtitle="Your data stays yours"
              />
            </View>

            {/* CTA Buttons */}
            <View className="space-y-4">
              <AuthButton
                title="Get Started"
                variant="primary"
                onPress={() => navigation.navigate('Auth')}
                className="mb-3"
              />
              <Pressable
                onPress={() => navigation.navigate('Auth', { mode: 'signin' })}
                className="py-4"
              >
                <ThemedText className="text-primary text-center font-medium">
                  Already have an account? Sign In
                </ThemedText>
              </Pressable>
            </View>
          </Animated.View>

          {/* Legal Footer */}
          <View className="items-center py-6 border-t border-neutral-200">
            <View className="flex-row space-x-6">
              <Pressable onPress={() => {}}>
                <ThemedText className="text-xs text-text-secondary">
                  Privacy Policy
                </ThemedText>
              </Pressable>
              <Pressable onPress={() => {}}>
                <ThemedText className="text-xs text-text-secondary">
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
```

### 2. Authentication Screen

**Purpose:** Primary OAuth authentication interface with provider options

**Layout Structure:**
```
┌─────────────────────────┐
│    [Back]    Auth       │
├─────────────────────────┤
│                         │
│    Welcome Back /       │
│    Create Account       │
│                         │
│    [Google OAuth]       │
│    [GitHub OAuth]       │
│                         │
│    ─── OR ─────         │
│                         │
│    [Continue as Guest]  │
│                         │
│    Security Note        │
│    Legal Links          │
└─────────────────────────┘
```

**Component Implementation:**

```tsx
import React, { useState } from 'react';
import { View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

// OAuth configuration
const googleConfig = {
  clientId: 'your-google-client-id',
  scopes: ['openid', 'profile', 'email'],
  redirectUri: makeRedirectUri(),
};

const AuthScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const isSignIn = route?.params?.mode === 'signin';

  // Google OAuth setup
  const [googleRequest, googleResponse, googlePromptAsync] = useAuthRequest(
    googleConfig,
    { authorizationEndpoint: 'https://accounts.google.com/oauth/authorize' }
  );

  const handleGoogleAuth = async () => {
    setLoadingProvider('google');
    try {
      const result = await googlePromptAsync();
      if (result.type === 'success') {
        // Handle successful authentication
        await processOAuthResult(result, 'google');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      Alert.alert('Authentication Error', 'Failed to sign in with Google');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGitHubAuth = async () => {
    setLoadingProvider('github');
    // Similar implementation for GitHub
    setLoadingProvider(null);
  };

  const processOAuthResult = async (result, provider) => {
    setIsLoading(true);
    try {
      // Process authentication result
      // Navigate to onboarding or main app
      navigation.navigate('Onboarding');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedView colorName="background" className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </Pressable>
          <ThemedText className="text-lg font-semibold">
            {isSignIn ? 'Sign In' : 'Create Account'}
          </ThemedText>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6 py-8">
          {/* Title Section */}
          <View className="mb-12">
            <ThemedText className="text-2xl font-bold mb-3">
              {isSignIn ? 'Welcome back!' : 'Join WalletWatch'}
            </ThemedText>
            <ThemedText className="text-base text-text-secondary">
              {isSignIn 
                ? 'Sign in to access your financial data across all devices'
                : 'Create your account to start tracking your finances securely'
              }
            </ThemedText>
          </View>

          {/* OAuth Buttons */}
          <View className="space-y-4 mb-8">
            <OAuthButton
              provider="google"
              title={`${isSignIn ? 'Sign in' : 'Continue'} with Google`}
              onPress={handleGoogleAuth}
              isLoading={loadingProvider === 'google'}
              disabled={isLoading}
            />
            
            <OAuthButton
              provider="github"
              title={`${isSignIn ? 'Sign in' : 'Continue'} with GitHub`}
              onPress={handleGitHubAuth}
              isLoading={loadingProvider === 'github'}
              disabled={isLoading}
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
            onPress={() => navigation.navigate('(tabs)')}
            className="py-4 items-center border border-neutral-200 rounded-xl mb-8"
            disabled={isLoading}
          >
            <ThemedText className="text-base font-medium text-text-secondary">
              Continue as Guest
            </ThemedText>
            <ThemedText className="text-xs text-text-secondary mt-1">
              Limited features, data stored locally only
            </ThemedText>
          </Pressable>

          {/* Security Note */}
          <View className="bg-surface p-4 rounded-xl mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark" size={20} color="#00B4D8" />
              <ThemedText className="ml-2 text-sm font-medium">
                Your data is secure
              </ThemedText>
            </View>
            <ThemedText className="text-xs text-text-secondary">
              We use industry-standard encryption and never share your 
              personal financial data with third parties.
            </ThemedText>
          </View>

          {/* Legal Links */}
          <View className="flex-row justify-center space-x-6">
            <Pressable onPress={() => {}}>
              <ThemedText className="text-xs text-text-secondary underline">
                Privacy Policy
              </ThemedText>
            </Pressable>
            <Pressable onPress={() => {}}>
              <ThemedText className="text-xs text-text-secondary underline">
                Terms of Service
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};
```

### 3. OAuth Button Component

**Reusable OAuth provider buttons with brand-compliant styling:**

```tsx
import React from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '@/components/ThemedText';

interface OAuthButtonProps {
  provider: 'google' | 'github';
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  title,
  onPress,
  isLoading = false,
  disabled = false
}) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          backgroundColor: '#FFFFFF',
          borderColor: '#DADCE0',
          textColor: '#3C4043',
          icon: 'logo-google',
          iconColor: '#4285F4'
        };
      case 'github':
        return {
          backgroundColor: '#24292F',
          borderColor: '#24292F',
          textColor: '#FFFFFF',
          icon: 'logo-github',
          iconColor: '#FFFFFF'
        };
      default:
        return {};
    }
  };

  const config = getProviderConfig();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`
        flex-row items-center justify-center px-4 py-4 rounded-xl
        border-2 active:scale-95 transition-transform
        ${disabled || isLoading ? 'opacity-50' : ''}
      `}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={config.textColor} 
          className="mr-3"
        />
      ) : (
        <Ionicons 
          name={config.icon} 
          size={20} 
          color={config.iconColor} 
          style={{ marginRight: 12 }}
        />
      )}
      
      <ThemedText 
        className="text-base font-semibold"
        style={{ color: config.textColor }}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
};
```

### 4. Onboarding Flow

**Multi-step introduction for new OAuth users:**

```tsx
const OnboardingScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState({
    notifications: false,
    biometric: false,
  });

  const onboardingSteps = [
    {
      title: "Welcome to WalletWatch",
      subtitle: "Let's set up your account for the best experience",
      component: <WelcomeStep />,
    },
    {
      title: "Enable Notifications",
      subtitle: "Stay on top of your tasks and financial goals",
      component: <NotificationPermissionStep 
        onPermissionChange={(granted) => 
          setPermissions(prev => ({ ...prev, notifications: granted }))
        }
      />,
    },
    {
      title: "Secure Access",
      subtitle: "Enable biometric authentication for quick, secure access",
      component: <BiometricPermissionStep 
        onPermissionChange={(granted) => 
          setPermissions(prev => ({ ...prev, biometric: granted }))
        }
      />,
    },
    {
      title: "You're All Set!",
      subtitle: "Start tracking your finances and achieving your goals",
      component: <CompletionStep />,
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('(tabs)');
    }
  };

  const handleSkip = () => {
    navigation.navigate('(tabs)');
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedView colorName="background" className="flex-1">
        {/* Progress Indicator */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between items-center">
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                className={`h-2 flex-1 mx-1 rounded-full ${
                  index <= currentStep ? 'bg-primary' : 'bg-neutral-200'
                }`}
              />
            ))}
          </View>
          <View className="flex-row justify-between mt-4">
            <Pressable onPress={handleSkip}>
              <ThemedText className="text-sm text-text-secondary">
                Skip
              </ThemedText>
            </Pressable>
            <ThemedText className="text-sm text-text-secondary">
              {currentStep + 1} of {onboardingSteps.length}
            </ThemedText>
          </View>
        </View>

        {/* Current Step Content */}
        <View className="flex-1 px-6">
          <View className="mb-8">
            <ThemedText className="text-2xl font-bold mb-2">
              {onboardingSteps[currentStep].title}
            </ThemedText>
            <ThemedText className="text-base text-text-secondary">
              {onboardingSteps[currentStep].subtitle}
            </ThemedText>
          </View>

          <View className="flex-1">
            {onboardingSteps[currentStep].component}
          </View>

          {/* Navigation */}
          <View className="pb-8">
            <AuthButton
              title={currentStep === onboardingSteps.length - 1 ? "Get Started" : "Continue"}
              variant="primary"
              onPress={handleNext}
            />
            
            {currentStep > 0 && (
              <Pressable
                onPress={() => setCurrentStep(currentStep - 1)}
                className="py-4 items-center"
              >
                <ThemedText className="text-primary font-medium">
                  Back
                </ThemedText>
              </Pressable>
            )}
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};
```

### 5. Account Linking Interface

**Manage connected OAuth providers in settings:**

```tsx
const AccountLinkingScreen = () => {
  const [linkedAccounts, setLinkedAccounts] = useState([
    { provider: 'google', email: 'user@gmail.com', linked: true },
    { provider: 'github', username: 'username', linked: false },
  ]);

  const handleToggleLink = async (provider: string) => {
    // Implementation for linking/unlinking providers
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedView colorName="background" className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 border-b border-neutral-200">
          <ThemedText className="text-xl font-semibold">
            Connected Accounts
          </ThemedText>
          <ThemedText className="text-sm text-text-secondary mt-1">
            Link additional accounts for enhanced security and backup options
          </ThemedText>
        </View>

        <ScrollView className="flex-1 px-6">
          {/* Account List */}
          <View className="py-6">
            {linkedAccounts.map((account) => (
              <AccountCard
                key={account.provider}
                account={account}
                onToggle={() => handleToggleLink(account.provider)}
              />
            ))}
          </View>

          {/* Security Benefits */}
          <View className="bg-surface p-4 rounded-xl mb-6">
            <ThemedText className="text-base font-semibold mb-2">
              Benefits of Linking Accounts
            </ThemedText>
            <BenefitItem 
              icon="shield-checkmark"
              title="Enhanced Security" 
              description="Multiple authentication options"
            />
            <BenefitItem 
              icon="cloud-sync"
              title="Reliable Backup" 
              description="Access your data from any linked account"
            />
            <BenefitItem 
              icon="key"
              title="Account Recovery" 
              description="Recover access if you lose primary account"
            />
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
};

const AccountCard = ({ account, onToggle }) => (
  <View className="flex-row items-center justify-between bg-surface p-4 rounded-xl mb-3">
    <View className="flex-row items-center flex-1">
      <View className="w-12 h-12 bg-neutral-100 rounded-xl items-center justify-center mr-3">
        <Ionicons 
          name={account.provider === 'google' ? 'logo-google' : 'logo-github'} 
          size={24} 
          color={account.provider === 'google' ? '#4285F4' : '#24292F'} 
        />
      </View>
      <View className="flex-1">
        <ThemedText className="text-base font-medium capitalize">
          {account.provider}
        </ThemedText>
        <ThemedText className="text-sm text-text-secondary">
          {account.email || account.username}
        </ThemedText>
      </View>
    </View>
    
    <Pressable
      onPress={onToggle}
      className={`px-4 py-2 rounded-lg ${
        account.linked ? 'bg-error' : 'bg-primary'
      }`}
    >
      <ThemedText className="text-white text-sm font-medium">
        {account.linked ? 'Unlink' : 'Link'}
      </ThemedText>
    </Pressable>
  </View>
);
```

---

## Responsive Design Considerations

### Screen Size Adaptations

```typescript
const ResponsiveBreakpoints = {
  small: { width: 375, height: 667 },   // iPhone SE
  medium: { width: 390, height: 844 },  // iPhone 14
  large: { width: 428, height: 926 },   // iPhone 14 Pro Max
  tablet: { width: 768, height: 1024 }  // iPad
};

// Responsive utilities
const useResponsiveLayout = () => {
  const { width, height } = useWindowDimensions();
  
  return {
    isSmall: width <= ResponsiveBreakpoints.small.width,
    isMedium: width <= ResponsiveBreakpoints.medium.width,
    isLarge: width <= ResponsiveBreakpoints.large.width,
    isTablet: width >= ResponsiveBreakpoints.tablet.width,
    
    // Dynamic spacing
    containerPadding: width <= 375 ? 16 : 24,
    buttonHeight: width <= 375 ? 48 : 56,
    
    // Typography scaling
    heroFontSize: isTablet ? 40 : width <= 375 ? 28 : 32,
    bodyFontSize: width <= 375 ? 14 : 16
  };
};
```

### Safe Area Handling

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ResponsiveAuthScreen = () => {
  const insets = useSafeAreaInsets();
  const { containerPadding, buttonHeight } = useResponsiveLayout();

  return (
    <View 
      style={{ 
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, 20),
        paddingHorizontal: containerPadding 
      }}
    >
      {/* Content */}
    </View>
  );
};
```

---

## Accessibility Implementation

### WCAG 2.1 AA Compliance

```tsx
const AccessibleOAuthButton = ({ provider, title, onPress, isLoading }) => (
  <Pressable
    onPress={onPress}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={`${title}. ${isLoading ? 'Loading' : 'Double tap to authenticate'}`}
    accessibilityState={{ 
      busy: isLoading, 
      disabled: isLoading 
    }}
    accessibilityHint={`Sign in using your ${provider} account`}
    className="..."
  >
    {/* Button content */}
  </Pressable>
);
```

### Focus Management

```tsx
import { AccessibilityInfo } from 'react-native';

const AuthScreen = () => {
  const firstButtonRef = useRef(null);

  useEffect(() => {
    // Announce screen change
    AccessibilityInfo.announceForAccessibility('Authentication screen loaded');
    
    // Focus first interactive element
    setTimeout(() => {
      firstButtonRef.current?.focus();
    }, 100);
  }, []);

  return (
    // Screen content with proper ref assignment
  );
};
```

---

## Performance Optimizations

### Image and Asset Optimization

```typescript
// Preload OAuth provider icons
const preloadAssets = async () => {
  const images = [
    require('@/assets/images/google-icon.png'),
    require('@/assets/images/github-icon.png'),
  ];
  
  await Promise.all(
    images.map(image => Asset.fromModule(image).downloadAsync())
  );
};
```

### Animation Performance

```tsx
// Hardware-accelerated animations
const fadeIn = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(fadeIn.value, { duration: 300 }),
  transform: [
    { translateY: withTiming(fadeIn.value ? 0 : 20, { duration: 300 }) }
  ]
}));

// Use native driver where possible
Animated.timing(animValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true // Critical for performance
}).start();
```

---

## Error Handling & Edge Cases

### Comprehensive Error States

```tsx
const ErrorBoundary = ({ error, retry }) => (
  <View className="flex-1 items-center justify-center px-6">
    <View className="w-16 h-16 bg-error-background rounded-full items-center justify-center mb-4">
      <Ionicons name="warning" size={32} color="#FF4444" />
    </View>
    
    <ThemedText className="text-xl font-semibold mb-2">
      Something went wrong
    </ThemedText>
    
    <ThemedText className="text-base text-text-secondary text-center mb-6">
      {error.message || 'We encountered an unexpected error. Please try again.'}
    </ThemedText>
    
    <AuthButton
      title="Try Again"
      variant="primary"
      onPress={retry}
      className="mb-4"
    />
    
    <Pressable onPress={() => navigation.goBack()}>
      <ThemedText className="text-primary font-medium">
        Go Back
      </ThemedText>
    </Pressable>
  </View>
);
```

### Network State Handling

```tsx
import NetInfo from '@react-native-async-storage/netinfo';

const useNetworkAwareAuth = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return unsubscribe;
  }, []);

  const handleOfflineAuth = () => {
    Alert.alert(
      'No Internet Connection',
      'OAuth authentication requires an internet connection. Please check your network and try again.',
      [{ text: 'OK' }]
    );
  };

  return { isConnected, handleOfflineAuth };
};
```

---

## Implementation Guidelines

### Development Checklist

**Phase 1: Core Components**
- [ ] Set up OAuth providers (Google, GitHub)
- [ ] Create base authentication screens
- [ ] Implement responsive design system
- [ ] Add accessibility features

**Phase 2: Enhanced Features**
- [ ] Add loading states and animations
- [ ] Implement error handling
- [ ] Create onboarding flow
- [ ] Add account linking functionality

**Phase 3: Polish & Testing**
- [ ] Test on various screen sizes
- [ ] Verify accessibility compliance
- [ ] Performance optimization
- [ ] Security audit

### File Structure

```
/auth/
├── components/
│   ├── AuthButton.tsx
│   ├── OAuthButton.tsx
│   ├── TrustBadge.tsx
│   └── ErrorBoundary.tsx
├── screens/
│   ├── WelcomeScreen.tsx
│   ├── AuthScreen.tsx
│   ├── OnboardingScreen.tsx
│   └── AccountLinkingScreen.tsx
├── hooks/
│   ├── useOAuth.ts
│   ├── useResponsiveLayout.ts
│   └── useNetworkAwareAuth.ts
├── types/
│   └── auth.types.ts
└── utils/
    ├── oauth-config.ts
    └── auth-helpers.ts
```

This comprehensive design plan provides a complete foundation for implementing OAuth2 authentication screens in WalletWatch while maintaining consistency with the existing design system and ensuring excellent user experience across all scenarios.