import Colors from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    buttonStyle: {
        paddingVertical: 14,
        marginHorizontal: 32,
        backgroundColor: Colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    
    buttonModalCancel: {
        paddingVertical: 14,

        borderRadius: 10,
        borderWidth: 1, 
        borderColor: Colors.red_1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 32, 
        marginVertical: 12,
    },
    buttonTextModalCancel: {
        fontWeight: '700',
        fontSize: 17,
        color: Colors.red_1,
        textAlign: 'center'
    },
    buttonTextStyle: {
        fontWeight: '700',
        fontSize: 17,
        color: Colors.white,
        textAlign: 'center'
    }
})
