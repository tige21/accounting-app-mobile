import { LevelInfo } from '@/UI/LevelInfo'
import Colors from '@/constants/Colors'
import useFetchDeckSvg from '@/features/hooks/useFetchDeckSvg'
import { useAppDispatch, useAppSelector } from '@/features/hooks/useRedux'
import {useDislikeDeckMutation, useGetLevelsQuery, useLikeDeckMutation} from '@/services/api'
import { IDeck, ILevelData } from '@/services/types/types'
import { addDeckId, removeDeckId } from '@/store/reducer/deck-likes-slice'
import { FontAwesome } from '@expo/vector-icons'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useMemo, useRef,
	useState
} from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle
} from 'react-native'
import { SvgXml } from 'react-native-svg'
import { LevelButtons } from './LevelButtons'
import Loader from './Loader'
import {useUserId} from "@/features/hooks";
import {ILevelsInfo} from "@/features/converters/levels-info-converter";
import {getLevelColor} from "@/features/converters/button-converters";
import {getLevelsInfo} from "@/features/converters";

const { width } = Dimensions.get('window')

interface CustomBottomSheetModalProps {
	deck: IDeck
	userId: string
}

export type Ref = BottomSheetModal
const renderBackdrop = ()=>useCallback(
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
	({ deck, userId }, ref) => {
		const snapPoints = useMemo(() => ['80%'], [])
		return (
			<BottomSheetModal
				ref={ref}
				index={0}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop()}
				backgroundStyle={styles.bottomSheetModal}
			>
				<DeckInfoSheet deck={deck} userId={userId}/>
			</BottomSheetModal>
		)
	}
)

const DeckInfoSheet = ({
	deck, userId
}: {
	deck: IDeck
	userId: string
})=>{
	const {data: levels, isLoading, isError} = useGetLevelsQuery(
		{deckId: deck.id, time: useRef(Date.now()).current, clientId: userId})
	console.log(deck.id, userId, levels, isError)
	const levelInfo = getLevelsInfo(levels?.length ?? 0)
	if(isLoading || !levels) {
		return <Loader/>
	}
	return <View style={{ flex: 1, marginBottom: 65, gap: 20 }}>
		<DeckInfoTopContent levels={levels} deck={deck}/>
		<DeckDescription deck={deck}/>
		<LevelInfo levelInfo={levelInfo} />
		<LevelButtons levels={levels} />
	</View>
}

const DeckDescription = ({
	deck,
	style,
}: {
	deck: IDeck
	style?: ViewStyle
}) => {
	const {
		svgData,
		isLoadingImage,
	} = useFetchDeckSvg(deck?.image_id)
	return <View style={[styles.commonInformation, style]}>
		{isLoadingImage ? (
			<Loader/>
		) : svgData ? (
			<View>
				<SvgXml xml={svgData} width={121} height={118}/>
			</View>
		) : (
			<Text>.</Text>
		)}
		<Text style={styles.deckTitle}>
			{deck.name.toLowerCase() || 'Название колоды'}
		</Text>
		<Text style={styles.deckDescription}>
			{deck.description.toLowerCase() || 'описание колоды'}
		</Text>
	</View>
}

const DeckInfoTopContent = ({
	deck,
	levels
}: {
	deck: IDeck
	levels: ILevelData[]
}) =>
{
	const dispatch = useAppDispatch()
	const decksLikesSet = useAppSelector(state => state.decksLikes.decksLikesSet)
	const userId = useUserId()
	const [likeDeck] = useLikeDeckMutation()
	const [dislikeDeck] = useDislikeDeckMutation()

	const isLiked = decksLikesSet.has(deck.id)

	const handleLike = async () => {
		try {
			if (isLiked) {
				await dislikeDeck({ deckId: deck.id, userId })
				dispatch(removeDeckId(deck.id))
			} else {
				await likeDeck({ deckId: deck.id, userId })
				dispatch(addDeckId(deck.id))
			}
		} catch (e) {
			console.error('Error:', e)
		}
	}
	return (
		<View style={[styles.topContent]}>
			<View>
				{levels.map(level=>{
					const all = level.counts.questionsCount
					const opened = level.counts.openedQuestionsCount
					const progressPercents = all>0 ? (opened/all*100) : 0
					return <View key={level.ID} style={styles.deckProgress}>
						<View style={styles.progressBar}>
							<View style={{
								...styles.progressColor,
								backgroundColor: getLevelColor(level.ColorButton),
								width: `${progressPercents}%`
							}}></View>
						</View>
						<Text
							style={styles.progressText}
						>{opened} / {all}</Text>
					</View>
				})}
			</View>
			<TouchableOpacity style={styles.likes} onPress={handleLike}>
				<FontAwesome
					style={{
						marginLeft: 10,
						marginRight: 10
					}}
					name={isLiked ? 'heart' : 'heart-o'}
					size={16}
					color={Colors.orange}
				/>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	topContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 20
	},
	deckProgress: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	progressBar: {
		width: 80,
		height: 8,
		backgroundColor: '#EBEBEB',
		borderRadius: 4,
		marginTop: 4,
		marginBottom: 4
	},
	progressColor: {
		height: '100%',
		width: '0%',
		borderRadius: 4
	},
	progressText: {
		marginLeft: 10,
		color: '#ADADAD'
	},
	likes: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 20,
		backgroundColor: '#F2F2F2',
		borderRadius: 10
	},

	commonInformation: {
		marginTop: 20,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	deckTitle: {
		color: Colors.deepGray,
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 33
	},

	deckDescription: {
		width: '90%',
		color: Colors.grey1,
		fontSize: 16,
		fontWeight: '400',
		textAlign: 'center',
		marginTop: 33
	},

	bottomSheetModal: {
		borderRadius: 32
	}
})

export default CustomBottomSheetModal
