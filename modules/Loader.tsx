import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const Loader = () => {
	return (
		<View style={styles.loader}>
			<ActivityIndicator size='large' />
		</View>
	)
}

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default Loader
