import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

interface CustomBottomSheetModalProps {
	kek: string
}

export type Ref = BottomSheetModal
const renderBackdrop = () =>
	useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				{...props}
			/>
		),
		[]
	)
const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(
	({ kek }, ref) => {
		const snapPoints = useMemo(() => ['60%'], [])

		const [selected, setSelected] = useState('')

		return (
			<BottomSheetModal
				ref={ref}
				index={0}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop()}
				backgroundStyle={styles.bottomSheetModal}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',

						margin: 20
					}}
				>
					<Text>Добавление транзакции</Text>
					<View
						style={{
							flex: 1,
							width: '100%',
							justifyContent: 'center'
						}}
					>
						<Calendar
							onDayPress={day => {
								setSelected(day.dateString)
							}}
							markedDates={{
								[selected]: {
									selected: true,
									disableTouchEvent: true,
									selectedColor: 'orange'
								}
							}}
						/>
					</View>

					<TouchableOpacity
						style={{
							height: 50,
							width: '100%',
							backgroundColor: '#3D42C4',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 10
						}}
						onPress={() => ref?.current?.dismiss()}
					>
						<Text
							style={{
								fontWeight: 'medium',
								fontSize: 17,
								color: 'white',
								textAlign: 'center'
							}}
						>
							Сохранить
						</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetModal>
		)
	}
)

const styles = StyleSheet.create({
	bottomSheetModal: {
		borderRadius: 32
	}
})

export default CustomBottomSheetModal
