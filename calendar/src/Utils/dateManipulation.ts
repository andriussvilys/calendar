export const WEEKDAYS = 7;
export const HOUR_COUNT = 24;
export const MILISECOND_HOUR = 60 * 60 * 1000;

export enum LocaleType {
	US = "en",
	LT = "lt-LT",
	AF = "fa-AF",
}

export const getToday = (): Date => new Date();

export const isSameWeek = (date1: Date, date2: Date): boolean => {
	const week = getWeekDates(date1);
	const result = week.find((item) => isSameDate(item, date2));
	return !!result;
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
	const year = date1.getFullYear() === date2.getFullYear();
	const month = date1.getMonth() === date2.getMonth();
	const date = date1.getDate() === date2.getDate();

	return year && month && date;
};

export const getWeekDates = (date: Date): Date[] => {
	const weekDay = date.getDay();
	const diffToMonday = (weekDay - 1 + WEEKDAYS) % WEEKDAYS;
	const monday = incrementDay(date, -diffToMonday);
	const weekDays = [];

	for (let index = 0; index < WEEKDAYS; index++) {
		weekDays.push(incrementDay(monday, index));
	}

	return weekDays;
};

export const incrementDay = (date: Date, incrValue: number): Date => {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate() + incrValue
	);
};

export const incrementMonth = (date: Date, incrValue: number): Date => {
	return new Date(date.getFullYear(), date.getMonth() + incrValue, 15);
};

export const getDayStart = (timestamp: number): number => {
	const day = new Date(timestamp);
	day.setHours(0);
	day.setMinutes(0);
	day.setSeconds(0);
	day.setMilliseconds(0);

	return day.valueOf();
};

export default {
	LocaleType,
	getToday,
	isSameDate,
	getWeekDates,
	incrementDay,
	incrementMonth,
	getDayStart,
};
