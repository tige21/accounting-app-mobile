import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ResponsiveBreakpoints {
  small: { width: number; height: number };
  medium: { width: number; height: number };
  large: { width: number; height: number };
  tablet: { width: number; height: number };
}

interface ResponsiveLayout {
  // Device classification
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  
  // Current dimensions
  width: number;
  height: number;
  
  // Responsive values
  containerPadding: number;
  buttonHeight: number;
  cardPadding: number;
  sectionSpacing: number;
  
  // Typography scaling
  heroFontSize: number;
  titleFontSize: number;
  bodyFontSize: number;
  captionFontSize: number;
  
  // Grid and layout
  numberOfColumns: number;
  itemSpacing: number;
  
  // Safe area considerations
  headerHeight: number;
  tabBarHeight: number;
}

const breakpoints: ResponsiveBreakpoints = {
  small: { width: 375, height: 667 },   // iPhone SE
  medium: { width: 390, height: 844 },  // iPhone 14
  large: { width: 428, height: 926 },   // iPhone 14 Pro Max
  tablet: { width: 768, height: 1024 }  // iPad
};

export const useResponsiveLayout = (): ResponsiveLayout => {
  const [screenData, setScreenData] = useState<ScaledSize>(
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = screenData;
  const isLandscape = width > height;

  // Device classification
  const isSmall = width <= breakpoints.small.width;
  const isMedium = width <= breakpoints.medium.width && width > breakpoints.small.width;
  const isLarge = width <= breakpoints.large.width && width > breakpoints.medium.width;
  const isTablet = width >= breakpoints.tablet.width;

  // Responsive spacing values
  const getContainerPadding = (): number => {
    if (isTablet) return 32;
    if (isSmall) return 16;
    return 24;
  };

  const getButtonHeight = (): number => {
    if (isTablet) return 64;
    if (isSmall) return 48;
    return 56;
  };

  const getCardPadding = (): number => {
    if (isTablet) return 24;
    if (isSmall) return 12;
    return 16;
  };

  const getSectionSpacing = (): number => {
    if (isTablet) return 48;
    if (isSmall) return 24;
    return 32;
  };

  // Typography scaling
  const getHeroFontSize = (): number => {
    if (isTablet) return 48;
    if (isSmall) return 28;
    return 32;
  };

  const getTitleFontSize = (): number => {
    if (isTablet) return 32;
    if (isSmall) return 22;
    return 28;
  };

  const getBodyFontSize = (): number => {
    if (isTablet) return 18;
    if (isSmall) return 14;
    return 16;
  };

  const getCaptionFontSize = (): number => {
    if (isTablet) return 16;
    if (isSmall) return 12;
    return 14;
  };

  // Grid layout
  const getNumberOfColumns = (): number => {
    if (isTablet && isLandscape) return 4;
    if (isTablet) return 3;
    if (isLandscape && !isSmall) return 2;
    return 1;
  };

  const getItemSpacing = (): number => {
    if (isTablet) return 20;
    if (isSmall) return 12;
    return 16;
  };

  // Navigation heights
  const getHeaderHeight = (): number => {
    if (isTablet) return 80;
    return 56;
  };

  const getTabBarHeight = (): number => {
    if (isTablet) return 72;
    return 64;
  };

  return {
    // Device classification
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    isLandscape,
    
    // Current dimensions
    width,
    height,
    
    // Responsive values
    containerPadding: getContainerPadding(),
    buttonHeight: getButtonHeight(),
    cardPadding: getCardPadding(),
    sectionSpacing: getSectionSpacing(),
    
    // Typography scaling
    heroFontSize: getHeroFontSize(),
    titleFontSize: getTitleFontSize(),
    bodyFontSize: getBodyFontSize(),
    captionFontSize: getCaptionFontSize(),
    
    // Grid and layout
    numberOfColumns: getNumberOfColumns(),
    itemSpacing: getItemSpacing(),
    
    // Safe area considerations
    headerHeight: getHeaderHeight(),
    tabBarHeight: getTabBarHeight(),
  };
};

// Utility function for responsive styles
export const createResponsiveStyle = (
  small: any,
  medium?: any,
  large?: any,
  tablet?: any
) => {
  const { isSmall, isMedium, isLarge, isTablet } = useResponsiveLayout();
  
  if (isTablet && tablet !== undefined) return tablet;
  if (isLarge && large !== undefined) return large;
  if (isMedium && medium !== undefined) return medium;
  return small;
};

// Hook for responsive values with breakpoint-specific overrides
export const useResponsiveValue = <T>(values: {
  small: T;
  medium?: T;
  large?: T;
  tablet?: T;
}): T => {
  const { isSmall, isMedium, isLarge, isTablet } = useResponsiveLayout();
  
  if (isTablet && values.tablet !== undefined) return values.tablet;
  if (isLarge && values.large !== undefined) return values.large;
  if (isMedium && values.medium !== undefined) return values.medium;
  return values.small;
};

// Hook for responsive dimensions with aspect ratio considerations
export const useResponsiveDimensions = () => {
  const layout = useResponsiveLayout();
  
  const getOptimalCardWidth = (): number => {
    const { width, containerPadding, numberOfColumns, itemSpacing } = layout;
    const availableWidth = width - (containerPadding * 2);
    const spacingWidth = (numberOfColumns - 1) * itemSpacing;
    return (availableWidth - spacingWidth) / numberOfColumns;
  };
  
  const getModalWidth = (): number => {
    const { width, isTablet } = layout;
    if (isTablet) return Math.min(600, width * 0.8);
    return width * 0.9;
  };
  
  const getMaxContentWidth = (): number => {
    const { width, isTablet } = layout;
    if (isTablet) return Math.min(800, width);
    return width;
  };
  
  return {
    ...layout,
    cardWidth: getOptimalCardWidth(),
    modalWidth: getModalWidth(),
    maxContentWidth: getMaxContentWidth(),
  };
};