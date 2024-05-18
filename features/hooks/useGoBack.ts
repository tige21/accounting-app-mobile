// hooks/useDeckId.ts
import {
	IQuestonLevelAndColor
} from '@/features/converters/button-converters'
import { useGetAllQuestionsQuery, useGetLevelsQuery } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {useEffect, useRef, useState} from 'react'
import { Dimensions } from 'react-native'
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming
} from 'react-native-reanimated'
import {useUserId} from "@/features/hooks/useUserId";

const useGoBack = () => {
	const router = useRouter()

	const goBack = () => router.back()

	return {
		goBack,
	}
}

export default useGoBack
