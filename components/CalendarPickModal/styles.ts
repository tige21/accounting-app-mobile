import Colors from '@/constants/Colors'
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        gap: 30,
    },
    calendarContainer: {
        width: 335,
        height: 270,
        marginBottom: 32,
        justifyContent: 'center',
    },
    calendar: {
        backgroundColor: Colors.white,
        borderRadius: 33,
        height: 360,
    },
    selectedRange: {
        backgroundColor: 'blue',
        opacity: 0.2,
    },
    saveButton: {
        height: 50,
        width: '100%',
        backgroundColor: Colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    saveButtonText: {
        fontWeight: 'medium',
        fontSize: 17,
        color: Colors.white,
        textAlign: 'center',
    },
});

export const bottomSheetModalStyles = StyleSheet.create({
    bottomSheetModal: {
        borderRadius: 32,
    },
});