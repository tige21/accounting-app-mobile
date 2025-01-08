import dayjs from 'dayjs';

export const getDateRange = (timeFrame: 'day' | 'week' | 'month' | 'year') => {
  const now = dayjs();
  let start = now.startOf('day');
  let end = now.endOf('day');

  switch (timeFrame) {
    case 'week':
      start = now.startOf('week');
      end = now.endOf('week');
      break;
    case 'month':
      start = now.startOf('month');
      end = now.endOf('month');
      break;
    case 'year':
      start = now.startOf('year');
      end = now.endOf('year');
      break;
  }

  return { start: start.toDate(), end: end.toDate() };
};

export const isDateInRange = (date: Date, start: Date, end: Date) => {
  const dateToCheck = dayjs(date);
  return dateToCheck.isAfter(start) && dateToCheck.isBefore(end);
}; 