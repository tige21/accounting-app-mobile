import Colors from '@/constants/Colors'
import { Platform, StyleSheet } from 'react-native'

export default StyleSheet.create({
	iconContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	plusIconContainer: {
		position: 'absolute',
		bottom: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	graphicsNames: {
		flex: 1,
		margin: 20,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	graphicName: {
		color: '#A9ABE4'
	},
	transactions: {
		width: '100%',
		flexDirection: 'column',

		flex: 1
	},
	transactionItem: {
		height: 60,
		borderRadius: 10,
		alignItems: 'center',
		backgroundColor: '#ffffff',
		padding: 20,
		marginBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	transactionText: {
		color: '#333333',
		fontSize: 18,
		fontWeight: 500
	},
	container: {
		flex: 1,
		marginHorizontal: 16,
		marginVertical: 18
	},
	safeArea: {
		flex: 1,
		marginBottom: Platform.OS === 'ios' ? -55 : -20
	},
	amountText: {
		fontWeight: '900',
		fontSize: 48,
		color: '#333333'
	},

	pieChartWrapper: {
		alignItems: 'center',
		marginBottom: 30
	},
	categoryIcon: {
		borderRadius: 50,
		height: 36,
		width: 36,
		justifyContent: 'center',
		alignItems: 'center'
	},
	categoryWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10
	},
	categoryText: {
		color: '#333333',
		fontSize: 18,
		fontWeight: '500'
	},
	priceText: {
		color: '#333333',
		fontSize: 18,
		fontWeight: '800'
	},
	header: {
		marginBottom: 24
	},
	headerRow: {
		flexDirection: 'row'
	},
	title: {
		fontSize: 28,
		fontWeight: '600',
		color: Colors.black,
		marginBottom: 24
	},
	chartContainer: {
		height: 280,
		backgroundColor: '#ffffff',
		borderRadius: 30,
		marginTop: 20,
		flexDirection: 'column',
		marginBottom: 28
	},
	chartStatsContainer: {
		height: 400,
		width: '100%',
		backgroundColor: '#ffffff',
		borderRadius: 30,
		marginTop: 20,
		marginBottom: 28
	},
	barChartWrapper: {
		paddingHorizontal: 10,
		height: 300,
		alignItems: 'center'
	},
	emptyStateContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	emptyStateText: {
		fontSize: 18,
		color: '#666',
		textAlign: 'center',
		lineHeight: 24
	}    
})
