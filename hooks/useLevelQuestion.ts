import { useGetLevelsQuery, useGetQuestionQuery } from '@/services/api'
import {useEffect, useRef, useState} from 'react'

export const useLevelQuestion = (levelId: string, clientId: string) => {
	// const [level, setLevel] = useState('')
	// const [textToShow, setTextToShow] = useState(
	// 	'Добро пожаловать, готовы выбрать вопрос?'
	// )
	const time = useRef(Date.now()).current

	// const {
	// 	data: buttons,
	// 	isLoading,
	// 	isError
	// } = useGetLevelsQuery({deckId: levelId.toString(), time})
	const { data: question, refetch, isLoading, isError } = useGetQuestionQuery({
		levelId: levelId,
		clientId: clientId,
		timestamp: time
	})

	// useEffect(() => {
	// 	if (question) {
	// 		setTextToShow(question.text)
	// 	}
	// }, [question])

	return { question, refetch, isLoading, isError }
}
