export interface IDeck {
	id: string;
	languageCode: string;
	name: string;
	emoji: string;
	description: string;
	labels: string;
	image_id: string;
	cardsCount: number;
	hidden: boolean;
	promo: string;
}

export interface IQuestion {
	id: string
	level_id: string
	text: string
	additional_text?: string
}

export interface ILevelData {
	ColorButton: string; // предполагаем, что это строка в формате 'r,g,b'
	ColorEnd: string; // также строка в формате 'r,g,b'
	ColorStart: string; // аналогично строка в формате 'r,g,b'
	DeckID: string; // или number, если это числовой ID
	ID: string; // UUID, так что это строка
	LevelOrder: number; // числовое значение
	Name: string; // строка с названием
	emoji: string; // строка с эмодзи
	counts: {
		questionsCount: number,
		openedQuestionsCount: number
	}
}

export interface DeckLike{
	id: string
	deckId: string
}

export interface QuestionLike{
	id: string
	questionId: string
}