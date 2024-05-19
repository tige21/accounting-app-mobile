// store.ts
import { api } from '@/services/api'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { enableMapSet } from 'immer'
import { useDispatch } from 'react-redux'
import languageReducer from './reducer/language-slice'


const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	language: languageReducer,

})

enableMapSet()

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: false
		}).concat(api.middleware)
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
