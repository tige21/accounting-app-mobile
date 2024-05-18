// api.ts
import {
	FetchArgs,
	createApi,
	fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
import { IDeck, ILevelData, IQuestion } from './types/types'

// http://logotipiwe.ru/haur/api/v1/
// const dynamicBaseQuery = async (
// 	args: string | FetchArgs,
// 	api: BaseQueryApi,
// 	extraOptions: {}
// ) => {
// 	const version = (await AsyncStorage.getItem('language')) || 'v1'
// 	console.log('dynamic version', version)
// 	const baseUrl = `https://logotipiwe.ru/haur/api/v2/decks?languageCode=en
// 	`

// 	// Вызываем fetchBaseQuery с динамическим baseUrl
// 	const baseQuery = fetchBaseQuery({ baseUrl })

// 	// Выполняем запрос с обновленным baseUrl
// 	return baseQuery(args, api, extraOptions)
// }

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://logotipiwe.ru/haur/api/' }),
	tagTypes: ['Decks', 'Levels', 'Question'],
	endpoints: builder => ({
		getDecks: builder.query<IDeck[], any>({
			query: (x: { language: string; time: number, clientId: string }) =>
				`/v3/decks?languageCode=${x.language}&clientId=${x.clientId}`,
			providesTags: _ => ['Decks']
		}),
		getLevels: builder.query<ILevelData[], { deckId: string; time: number, clientId: string }>({
			query: (x: { deckId: string; clientId: string, time: number }) =>
				`v1/deck/${x.deckId}/levels?clientId=${x.clientId}`
		}),
		getQuestion: builder.query<
			IQuestion,
			{ levelId: string; clientId: string; timestamp: number }
		>({
			query: ({ levelId, clientId, timestamp }) =>
				`v1/question?&levelId=${levelId}&clientId=${clientId}&time=${timestamp}`
		}),
		getAllQuestions: builder.query<any, any>({
			query: (x: { deckId: string; time: number }) =>
				`v1/deck/${x.deckId}/questions`
		}),

		getVectorImage: builder.query<any, any>({
			query: (x: { imageId: string; time: number }) =>
				`v1/get-vector-image/${x.imageId}`,
			transformResponse: (response: Response) => response.text()
		}),
		getAllLikes: builder.query<any, any>({
			query: userId => `v1/user/${userId}/likes`
		}),
		likeDeck: builder.mutation<FetchArgs | any, any>({
			query: ({ deckId, userId }) => {
				return {
					url: `v1/deck/${deckId}/like?userId=${userId}`,
					method: 'POST',
					body: { deckId, userId }
				}
			}
		}),
		dislikeDeck: builder.mutation<FetchArgs | any, any>({
			query: ({ deckId, userId }) => {
				return {
					url: `v1/deck/${deckId}/dislike?userId=${userId}`,
					method: 'POST',
					body: { deckId, userId }
				}
			}
		}),
		likeQuestion: builder.mutation<FetchArgs | any, any>({
			query: ({ questionId, userId }) => {
				return {
					url: `v1/question/${questionId}/like?userId=${userId}`,
					method: 'POST',
					body: { questionId, userId }
				}
			}
		}),
		dislikeQuestion: builder.mutation<FetchArgs | any, any>({
			query: ({ questionId, userId }) => {
				return {
					url: `v1/question/${questionId}/dislike?userId=${userId}`,
					method: 'POST',
					body: { questionId, userId }
				}
			}
		}),
		sendPromo: builder.mutation<FetchArgs | any, any>({
			query: ({ promo, userId }) => {
				return {
					url: `v1/enter-promo/${promo}?clientId=${userId}`,
					method: 'POST'
				}
			}
		})
	})
})

export const {
	useGetDecksQuery,
	useGetLevelsQuery,
	useGetQuestionQuery,
	useGetAllQuestionsQuery,
	useGetVectorImageQuery,
	useLikeDeckMutation,
	useDislikeDeckMutation,
	useLikeQuestionMutation,
	useDislikeQuestionMutation,
	useGetAllLikesQuery,
	useSendPromoMutation
} = api
