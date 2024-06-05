import {StyleSheet} from "react-native";

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
        marginTop: 30,
        width: '100%',
        flexDirection: 'column',
        paddingBottom: 20,
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

})