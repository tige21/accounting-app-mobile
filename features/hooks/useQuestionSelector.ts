import { ILevelData } from '@/services/types/types'
import { useEffect, useState } from 'react'

type Question = {
	id: string
	level_id: string
	text: string
}

type Level = {
	ID: string
	Name: string
}

const useQuestionSelector = (
	questions: Question[],
	levels: ILevelData[] | undefined
) => {
	const [questionsMap, setQuestionsMap] = useState<Map<string, Question[]>>(
		new Map()
	)
	const [usedQuestions, setUsedQuestions] = useState<Map<string, Set<string>>>(
		new Map()
	)

	useEffect(() => {
		const newQuestionsMap = new Map<string, Question[]>()
		const newUsedQuestions = new Map<string, Set<string>>()

		levels?.forEach(level => {
			newQuestionsMap.set(level.ID, [])
			newUsedQuestions.set(level.ID, new Set())
		})

		questions.forEach(question => {
			if (newQuestionsMap.has(question.level_id)) {
				newQuestionsMap.get(question.level_id)?.push(question)
			}
		})

		setQuestionsMap(newQuestionsMap)
		setUsedQuestions(newUsedQuestions)
	}, [questions, levels])

	const getQuestion = (levelId: string): string | null => {
		const availableQuestions = questionsMap.get(levelId)
		const usedQuestionIds = usedQuestions.get(levelId)

		if (!availableQuestions || !usedQuestionIds) return null

		const unusedQuestions = availableQuestions.filter(
			q => !usedQuestionIds.has(q.id)
		)

		if (unusedQuestions.length === 0) {
			return 'Вопросы по этому уровню закончились'
		}

		const randomIndex = Math.floor(Math.random() * unusedQuestions.length)
		const selectedQuestion = unusedQuestions[randomIndex]
		usedQuestionIds.add(selectedQuestion.id)

		return selectedQuestion.text
	}

	return { getQuestion }
}

export default useQuestionSelector
