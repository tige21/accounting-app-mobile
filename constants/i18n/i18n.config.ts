import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, ru } from './translations'

const resources = {
	en: {
		translation: en
	},
	ru: {
		translation: ru
	}
}

i18n.use(initReactI18next).init({
	compatibilityJSON: 'v3',
	debug: false,
	resources,
	lng: 'en',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false
	}
})

export default i18n
