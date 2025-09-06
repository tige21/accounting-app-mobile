export const createStyles = (colors: any) => ({
	container: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	header: {
		flexDirection: 'row' as const,
		justifyContent: 'space-between' as const,
		alignItems: 'center' as const,
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: colors.surface,
	},
	cancelButton: {
		fontSize: 17,
		color: colors.textSecondary,
		fontWeight: '400' as const,
	},
	doneButton: {
		fontSize: 17,
		color: colors.primary,
		fontWeight: '600' as const,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
		marginHorizontal: 20,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
		backgroundColor: colors.surface,
	},
	option: {
		flexDirection: 'row' as const,
		alignItems: 'center' as const,
		justifyContent: 'space-between' as const,
		paddingVertical: 16,
		paddingHorizontal: 16,
		marginVertical: 4,
		backgroundColor: colors.surfaceSecondary,
		borderRadius: 12,
		minHeight: 60,
	},
	optionSelected: {
		backgroundColor: colors.primary + '20',
		borderWidth: 1,
		borderColor: colors.primary,
	},
	optionContent: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	optionText: {
		fontSize: 16,
		fontWeight: '500' as const,
		color: colors.textPrimary,
		marginBottom: 2,
	},
	optionDescription: {
		fontSize: 14,
		color: colors.textSecondary,
		lineHeight: 18,
	},
	checkmarkContainer: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: colors.primary,
		alignItems: 'center' as const,
		justifyContent: 'center' as const,
		marginLeft: 12,
	},
})

export const bottomSheetModalStyles = {
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
}