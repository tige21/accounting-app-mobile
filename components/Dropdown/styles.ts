import { StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'

const styles = StyleSheet.create({
	dropdownView: {
		backgroundColor: Colors.white,
		borderRadius: 10,
	},
	selectedContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
	},
	placeholderText: {
		color: Colors.grey_1,
		fontSize: 17
	},
	selectedText: {
		color: Colors.black,
		fontSize: 17
	},
	dropdownOptions: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 16
	},
	icon: {
		marginRight: 16
	},
	itemText: {
		color: Colors.grey_1,
		fontSize: 17
	},
	selectedItemText: {
		color: Colors.black
	},
	listView: {
		backgroundColor: Colors.white,
		paddingLeft: 16,
		borderRadius: 10
	}
})

export default styles
