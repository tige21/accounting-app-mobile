import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.surface,
    },
    header: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
    },
    headerContent: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flex: 1,
    },
    headerIcon: {
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: colors.textPrimary,
        flex: 1,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.surfaceSecondary,
    },
    calendarContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        paddingHorizontal: 16,
    },
    calendar: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingVertical: 10,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 20,
        marginVertical: 16,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 16,
    },
    saveButton: {
        height: 50,
        width: '100%' as const,
        backgroundColor: colors.primary,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderRadius: 12,
    },
    saveButtonText: {
        fontWeight: '600' as const,
        fontSize: 17,
        color: colors.onPrimary,
        textAlign: 'center' as const,
    },
    infoContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 12,
        backgroundColor: colors.primary + '10',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
    },
    infoIcon: {
        marginRight: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 18,
        color: colors.textSecondary,
    },
});

export const bottomSheetModalStyles = StyleSheet.create({
    bottomSheetModal: {
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
});