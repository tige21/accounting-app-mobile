import { CATEGORIES } from '@/constants/categories';

export const getCategoryColor = (category: string): string => {
  const colorMap = {
    // Расходы
    [CATEGORIES.EXPENSES.HEALTH]: '#FE6F7B',
    [CATEGORIES.EXPENSES.TRANSPORT]: '#9E73FC',
    [CATEGORIES.EXPENSES.PETS]: '#93E850',
    [CATEGORIES.EXPENSES.BEAUTY]: '#F584FF',
    [CATEGORIES.EXPENSES.EDUCATION]: '#69BFFE',
    [CATEGORIES.EXPENSES.TRANSFERS]: '#6871FC',
    [CATEGORIES.EXPENSES.CAFE]: '#93E850',
    [CATEGORIES.EXPENSES.ENTERTAINMENT]: '#F584FF',
    [CATEGORIES.EXPENSES.GROCERIES]: '#6871FC',
    [CATEGORIES.EXPENSES.HOUSE]: '#FFC047',
    [CATEGORIES.EXPENSES.OTHER]: '#969696',
    // Доходы
    [CATEGORIES.INCOME.PASSIVE]: '#93E850',
    [CATEGORIES.INCOME.GIFT]: '#F584FF',
    [CATEGORIES.INCOME.SALARY]: '#69BFFE',
    [CATEGORIES.INCOME.STOCKS]: '#FFC047',
    [CATEGORIES.INCOME.ADVANCE]: '#FE6F7B',
    [CATEGORIES.INCOME.FREELANCE]: '#9E73FC',
    [CATEGORIES.INCOME.CASHBACK]: '#6871FC',
    [CATEGORIES.INCOME.OTHER]: '#969696',
  };

  return colorMap[category] || '#969696';
};

export const categoryColors = {
  expense: [
    { category: 'Здоровье', color: '#FE6F7B' },
    { category: 'Транспорт', color: '#9E73FC' },
    { category: 'Животные', color: '#93E850' },
    { category: 'Красота', color: '#F584FF' },
    { category: 'Образование', color: '#69BFFE' },
    { category: 'Переводы', color: '#6871FC' },
    { category: 'Кафе', color: '#93E850' },
    { category: 'Развлечения', color: '#F584FF' },
    { category: 'Продукты', color: '#6871FC' },
    { category: 'Дом', color: '#FFC047' },
    { category: 'Другое', color: '#969696' }
  ],
  income: [
    { category: 'Пассивный', color: '#93E850' },
    { category: 'Подарок', color: '#F584FF' },
    { category: 'Зарплата', color: '#69BFFE' },
    { category: 'Акции', color: '#FFC047' },
    { category: 'Аванс', color: '#FE6F7B' },
    { category: 'Фриланс', color: '#9E73FC' },
    { category: 'Кешбэк', color: '#6871FC' },
    { category: 'Другое', color: '#969696' }
  ]
}; 