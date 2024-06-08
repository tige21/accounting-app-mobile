import Colors from '@/constants/Colors'
import { StyleSheet } from 'react-native'
export default StyleSheet.create({
    iconView: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        borderRadius: 10,
        
    },
    iconViewActive: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.blue
    },
    categoryButton: {
        width: 60,
        height: 60,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
    },
    placeholderCategory: {
        fontSize: 8,
        color: Colors.grey_2
    },
    selectedText: {
        fontSize: 8,
        color: Colors.blue,
    },
})