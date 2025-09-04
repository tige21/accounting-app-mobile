# Bundle Size Optimization Plan

## Dependencies to Remove/Replace

### 1. Duplicate UUID Libraries
- **Current**: react-native-uuid + uuid
- **Action**: Remove `react-native-uuid`, use only `uuid`
- **Savings**: ~50KB

### 2. Duplicate Date Libraries  
- **Current**: date-fns + dayjs
- **Action**: Remove `date-fns`, use only `dayjs` (already primary)
- **Savings**: ~150KB

### 3. Unused State Management
- **Current**: mobx + mobx-react-lite (unused)
- **Action**: Remove MobX packages
- **Savings**: ~100KB

### 4. Multiple Chart Libraries
- **Current**: react-native-chart-kit + react-native-gifted-charts + react-native-pie
- **Action**: Keep only react-native-gifted-charts (most comprehensive)
- **Savings**: ~200KB

### 5. Duplicate Linear Gradient
- **Current**: expo-linear-gradient + react-native-linear-gradient
- **Action**: Remove react-native-linear-gradient, use expo-linear-gradient
- **Savings**: ~30KB

## Animation Files Optimization

### Current Large Assets:
- financeAnimation.json (136KB)
- animation.json (136KB) 
- anim.json (76KB)

**Action**: Compress Lottie animations using lottie-compression
**Potential Savings**: ~200KB (60% compression)

## Total Estimated Savings: ~730KB bundle reduction

## Implementation Steps:

1. Remove unused dependencies
2. Replace duplicate libraries
3. Compress animation assets
4. Update imports throughout codebase