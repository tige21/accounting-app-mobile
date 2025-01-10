import LottieView from 'lottie-react-native'
import React, { useRef } from 'react'
import { Dimensions, View } from 'react-native'

interface ISplashScreen {
	onAnimationFinish?: (isCancelled: boolean) => void
}

const { height } = Dimensions.get('screen')

const AnimateSplashScreen = ({ onAnimationFinish }: ISplashScreen) => {
	const animation = useRef<LottieView>(null)
	return (
		<View style={{ height: height, backgroundColor: '#f3f3f3' }}>
			<LottieView
				loop={false}
				onAnimationFinish={onAnimationFinish}
				style={{ height: height, width: '100%' }}
				ref={animation}
				autoPlay
				// source={require('@/assets/images/Oanimation.json')}
				source={require('@/assets/images/animation.json')}
			/>
		</View>
	)
}

export default AnimateSplashScreen
