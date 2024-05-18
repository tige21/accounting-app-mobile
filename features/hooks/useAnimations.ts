import { useSharedValue } from 'react-native-reanimated';

export const useAnimation = () => {
    const animationTrigger = useSharedValue(0);

    const triggerAnimation = () => {
        animationTrigger.value = 1;
        setTimeout(() => {
            animationTrigger.value = 0;
        }, 300);
    };

    return { animationTrigger, triggerAnimation };
};