import i18n from 'i18next'

const useLanguage = () => {
	const changeLanguage = () => {
		if (i18n.language === 'en') {
			i18n.changeLanguage('ru')
		} else {
			i18n.changeLanguage('en')
		}
	}

	return {
		changeLanguage
	}
}

export default useLanguage
