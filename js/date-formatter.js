import { getWeekDates } from "./dateManipulation.js";
export const createDateFormatter = (locale) => {
    let currentLocale = locale;
    return {
        getFormattedMonth: (date) => date.toLocaleDateString(currentLocale, {
            month: "long",
        }),
        getWeekDayLabels: (date) => {
            return getWeekDates(date).map((date) => {
                return date
                    .toLocaleDateString(currentLocale, { weekday: "short" })
                    .toUpperCase();
            });
        },
        getWeekDateLabel: (date) => {
            return date
                .toLocaleDateString(currentLocale, { weekday: "short" })
                .toUpperCase();
        },
        getWeekDates: (date) => {
            return getWeekDates(date).map((date) => {
                return date.toLocaleDateString(currentLocale, { day: "numeric" });
            });
        },
        getDate: (date) => {
            return date.toLocaleDateString(currentLocale, { day: "numeric" });
        },
        getYear: (date) => {
            return date.toLocaleDateString(currentLocale, { year: "numeric" });
        },
        getMonthYearLabel: (date) => {
            return date.toLocaleDateString(currentLocale, {
                year: "numeric",
                month: "long",
            });
        },
        getHour: (timestamp) => {
            return new Date(timestamp).toLocaleTimeString(currentLocale, {
                hour: "numeric",
                // minute: "numeric",
            });
        },
        getEventDate: (date) => {
            return date.toLocaleDateString(currentLocale, {
                weekday: "long",
                month: "long",
                day: "numeric",
            });
        },
        formatTimeString: (timestamp) => {
            return new Date(timestamp).toLocaleTimeString(currentLocale, {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
        },
        getEventHourRange: (startTimestamp, endTimestamp) => {
            const format = new Intl.DateTimeFormat(currentLocale, {
                hour: "numeric",
                minute: "numeric",
            });
            return format.formatRange(new Date(startTimestamp), new Date(endTimestamp));
        },
        changeLocale: (newLocale) => {
            currentLocale = newLocale;
        },
    };
};
