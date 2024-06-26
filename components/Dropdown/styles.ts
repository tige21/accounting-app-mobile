import { StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'

const styles = StyleSheet.create({
    container: {
		width: '100%'
	},
	input: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		backgroundColor: 'white'
	},
	placeholder: {
		color: '#ccc'
	},
	selectedText: {
		color: 'black'
	},
	dropdown: {
		marginTop: 5,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		backgroundColor: 'white'
	},
	item: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemContent: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		marginRight: 10
	},
	itemText: {
		color: '#ccc'
	},
	selectedItemText: {
		color: 'black',
		fontWeight: 'bold'
	}
})

export default styles
