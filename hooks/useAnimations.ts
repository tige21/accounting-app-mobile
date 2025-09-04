import { useSharedValue, withTiming, cancelAnimation } from 'react-native-reanimated';
import { useCallback, useEffect } from 'react';

export const useAnimation = () => {
    const animationTrigger = useSharedValue(0);

    const triggerAnimation = useCallback(() => {
        // Отменяем текущую анимацию если она выполняется
        cancelAnimation(animationTrigger);
        
        // Используем withTiming вместо setTimeout для лучшей производительности
        animationTrigger.value = withTiming(1, { duration: 150 }, (finished) => {
            'worklet';
            if (finished) {
                animationTrigger.value = withTiming(0, { duration: 150 });
            }
        });
    }, [animationTrigger]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            cancelAnimation(animationTrigger);
        };
    }, [animationTrigger]);

    return { animationTrigger, triggerAnimation };
};