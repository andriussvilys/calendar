import DateManipulation from "./dateManipulation.js";

export type DateFormatter = ReturnType<typeof createDateFormatter>;

export const createDateFormatter = (locale: string) => {
	let currentLocale = locale;

	return {
		getFormattedMonth: (date: Date): string =>
			date.toLocaleDateString(currentLocale, {
				month: "long",
			}),
		getWeekDayLabels: (date: Date): string[] => {
			return DateManipulation.getWeekDates(date).map((date: Date) => {
				return date
					.toLocaleDateString(currentLocale, { weekday: "short" })
					.toUpperCase();
			});
		},
		getWeekDateLabel: (date: Date): string => {
			return date
				.toLocaleDateString(currentLocale, { weekday: "short" })
				.toUpperCase();
		},
		getWeekDates: (date: Date): string[] => {
			return DateManipulation.getWeekDates(date).map((date: Date) => {
				return date.toLocaleDateString(currentLocale, { day: "numeric" });
			});
		},
		getDate: (date: Date): string => {
			return date.toLocaleDateString(currentLocale, { day: "numeric" });
		},
		getYear: (date: Date): string => {
			return date.toLocaleDateString(currentLocale, { year: "numeric" });
		},
		getMonthYearLabel: (date: Date): string => {
			return date.toLocaleDateString(currentLocale, {
				year: "numeric",
				month: "long",
			});
		},
		getHour: (timestamp: number): string => {
			return new Date(timestamp).toLocaleTimeString(currentLocale, {
				hour: "numeric",
			});
		},
		getEventDate: (date: Date): string => {
			return date.toLocaleDateString(currentLocale, {
				weekday: "long",
				month: "long",
				day: "numeric",
			});
		},
		formatTimeString: (timestamp: number): string => {
			return new Date(timestamp).toLocaleTimeString(currentLocale, {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});
		},
		getEventHourRange: (
			startTimestamp: number,
			endTimestamp: number
		): string => {
			const format: Intl.DateTimeFormat = new Intl.DateTimeFormat(
				currentLocale,
				{
					hour: "numeric",
					minute: "numeric",
				}
			);
			return format.formatRange(
				new Date(startTimestamp),
				new Date(endTimestamp)
			);
		},
		changeLocale: (newLocale: string) => {
			currentLocale = newLocale;
		},
	};
};
