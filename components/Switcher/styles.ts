import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	container: {
		width: 46,
		height: 24,
		zIndex: 100,
		borderRadius: 24,
		backgroundColor: 'white',
		justifyContent: 'center'
	},
	switcher: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: '100%'
	},
	knob: {
		width: 17,
		height: 17,
		borderRadius: 25,
		backgroundColor: '#A9ABE4',
		position: 'absolute'
	},
	labels: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	},
	label: {
		zIndex: 100,
		textAlign: 'center',
		fontWeight: '400',
		fontSize: 14,
		color: '#666'
	}
})