import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import our custom components and hooks
import { 
  AuthButton, 
  TrustBadge,
  ThemedText, 
  ThemedView 
} from '@/components';
import { 
  useResponsiveLayout,
  useThemeContext 
} from '@/hooks';

const WelcomeScreen = () => {
  const router = useRouter();
  const { isDark } = useThemeContext();
  const { 
    containerPadding, 
    buttonHeight, 
    heroFontSize, 
    titleFontSize, 
    bodyFontSize,
    sectionSpacing 
  } = useResponsiveLayout();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const navigateToAuth = (mode: 'signin' | 'signup' = 'signup') => {
    router.push({
      pathname: '/auth',
      params: { mode }
    });
  };

  const features = [
    {
      icon: 'wallet' as keyof typeof Ionicons.glyphMap,
      title: 'Smart Expense Tracking',
      description: 'Automatically categorize and track your spending with intelligent insights',
      color: '#007AFF'
    },
    {
      icon: 'list' as keyof typeof Ionicons.glyphMap,
      title: 'Task Management',
      description: 'Organize your financial goals and tasks with built-in reminders',
      color: '#34C759'
    },
    {
      icon: 'analytics' as keyof typeof Ionicons.glyphMap,
      title: 'Financial Analytics',
      description: 'Understand your spending patterns with detailed charts and reports',
      color: '#FF9500'
    },
    {
      icon: 'cloud-sync' as keyof typeof Ionicons.glyphMap,
      title: 'Secure Cloud Sync',
      description: 'Access your data anywhere with bank-level security and encryption',
      color: '#00B4D8'
    }
  ];

  return (
    <SafeAreaView className="flex-1">
      <ThemedView colorName="background" className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Hero Section */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }}
            className="items-center justify-center flex-1"
            style={{ 
              paddingHorizontal: containerPadding,
              paddingTop: sectionSpacing,
              minHeight: 400
            }}
          >
            {/* App Icon with Gradient */}
            <View className="relative mb-8">
              <LinearGradient
                colors={['#007AFF', '#5AC8FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-28 h-28 rounded-3xl items-center justify-center shadow-2xl"
                style={{
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <ThemedText className="text-white text-4xl font-bold">W</ThemedText>
              </LinearGradient>
              
              {/* Floating elements */}
              <View className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full opacity-80" />
              <View className="absolute -bottom-1 -left-1 w-4 h-4 bg-warning rounded-full opacity-60" />
            </View>

            {/* Hero Text */}
            <View className="items-center mb-12">
              <ThemedText 
                className="font-bold text-center mb-4 leading-tight"
                style={{ fontSize: heroFontSize }}
              >
                Take Control of{'\n'}Your Finances
              </ThemedText>
              
              <ThemedText 
                className="text-text-secondary text-center leading-relaxed max-w-sm"
                style={{ fontSize: bodyFontSize }}
              >
                Track expenses, manage tasks, and achieve your financial goals 
                with secure cloud synchronization across all your devices.
              </ThemedText>
            </View>

            {/* Trust Indicators */}
            <View className="flex-row justify-around w-full max-w-sm mb-12">
              <TrustBadge
                icon="shield-checkmark"
                title="Secure"
                subtitle="Bank-level security"
              />
              <TrustBadge
                icon="sync"
                title="Sync"
                subtitle="Cross-device sync"
              />
              <TrustBadge
                icon="lock-closed"
                title="Private"
                subtitle="Your data stays yours"
              />
            </View>

            {/* Call-to-Action Buttons */}
            <View className="w-full max-w-sm space-y-4">
              <AuthButton
                title="Get Started Free"
                onPress={() => navigateToAuth('signup')}
                variant="primary"
                style={{ height: buttonHeight }}
                icon={
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                }
              />
              
              <Pressable
                onPress={() => navigateToAuth('signin')}
                className="py-4 items-center active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="Sign in to existing account"
              >
                <ThemedText className="text-primary font-semibold" style={{ fontSize: bodyFontSize }}>
                  Already have an account? Sign In
                </ThemedText>
              </Pressable>
            </View>
          </Animated.View>

          {/* Features Section */}
          <View 
            className="bg-surface"
            style={{ paddingHorizontal: containerPadding }}
          >
            <View style={{ paddingVertical: sectionSpacing }}>
              <ThemedText 
                className="font-bold text-center mb-4"
                style={{ fontSize: titleFontSize }}
              >
                Everything you need to succeed
              </ThemedText>
              
              <ThemedText 
                className="text-text-secondary text-center mb-12 max-w-sm mx-auto"
                style={{ fontSize: bodyFontSize }}
              >
                Powerful features designed to help you build better financial habits
              </ThemedText>

              {/* Feature Grid */}
              <View className="space-y-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    delay={index * 100}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Social Proof Section */}
          <View 
            style={{ 
              paddingHorizontal: containerPadding,
              paddingVertical: sectionSpacing 
            }}
          >
            <View className="items-center">
              <ThemedText 
                className="font-semibold text-center mb-2"
                style={{ fontSize: titleFontSize }}
              >
                Trusted by thousands
              </ThemedText>
              
              <ThemedText 
                className="text-text-secondary text-center mb-8"
                style={{ fontSize: bodyFontSize }}
              >
                Join the growing community taking control of their finances
              </ThemedText>

              {/* Stats */}
              <View className="flex-row justify-around w-full max-w-sm">
                <StatItem title="10K+" subtitle="Active Users" />
                <StatItem title="$2M+" subtitle="Tracked Monthly" />
                <StatItem title="4.9★" subtitle="App Store Rating" />
              </View>
            </View>
          </View>

          {/* Final CTA */}
          <View 
            className="bg-primary"
            style={{ 
              paddingHorizontal: containerPadding,
              paddingVertical: sectionSpacing 
            }}
          >
            <View className="items-center">
              <ThemedText 
                className="text-white font-bold text-center mb-4"
                style={{ fontSize: titleFontSize }}
              >
                Ready to get started?
              </ThemedText>
              
              <ThemedText 
                className="text-white opacity-90 text-center mb-8"
                style={{ fontSize: bodyFontSize }}
              >
                Create your free account and start building better financial habits today.
              </ThemedText>

              <AuthButton
                title="Create Free Account"
                onPress={() => navigateToAuth('signup')}
                variant="secondary"
                className="bg-white"
                style={{ height: buttonHeight }}
              />
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  delay
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    }, delay);
  }, [delay]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
      className="flex-row items-start bg-background p-4 rounded-xl"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Icon */}
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center mr-4 mt-1"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <ThemedText className="text-base font-semibold mb-2">
          {title}
        </ThemedText>
        <ThemedText className="text-sm text-text-secondary leading-relaxed">
          {description}
        </ThemedText>
      </View>
    </Animated.View>
  );
};

// Stat Item Component
interface StatItemProps {
  title: string;
  subtitle: string;
}

const StatItem: React.FC<StatItemProps> = ({ title, subtitle }) => (
  <View className="items-center">
    <ThemedText className="text-2xl font-bold text-primary mb-1">
      {title}
    </ThemedText>
    <ThemedText className="text-xs text-text-secondary text-center">
      {subtitle}
    </ThemedText>
  </View>
);

export default WelcomeScreen;