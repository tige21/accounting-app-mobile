import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    paddingHorizontal: 4,
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
  doneButton: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '600' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pickerContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flex: 1,
    paddingVertical: 20,
  },
  wheelContainer: {
    alignItems: 'center' as const,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  wheelLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    marginHorizontal: 16,
    textAlign: 'center' as const,
  },
  wheelItemText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '500' as const,
  },
  selectedWheelItem: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: colors.primary + '20',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginHorizontal: 20,
    marginTop: 16,
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
  // iOS Native DatePicker styles
  nativeDatePickerContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 20,
  },
  nativeDatePicker: {
    width: '100%',
    height: 200,
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