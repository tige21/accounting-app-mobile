import { createSlice } from '@reduxjs/toolkit'

const cardsOfDeckSlice = createSlice({
	name: 'CardsOfDeckSlice',
	initialState: {
		deckSize: 0,
		count: 0
	},
	reducers: {
		incrementDeletedCards: state => {
			if (state.count < state.deckSize) {
				state.count += 1
			}
		},
		setDeckSize: (state, action) => {
			state.deckSize = action.payload
			if (state.count >= state.deckSize) {
				state.count = 0
			}
		}
	}
})

export const { incrementDeletedCards, setDeckSize } = cardsOfDeckSlice.actions
export default cardsOfDeckSlice.reducer
