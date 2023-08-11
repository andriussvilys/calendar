import { DateFormatter } from "./dateFormatter.js";
import {
	getLocale,
	getToday,
	incrementDay,
	setLocale,
	WEEKDAYS,
	LocaleType,
} from "./dateManipulation.js";
import { localeState, selectedDate } from "./state.js";

const handleNextPrevClick = (direction: number): void => {
	const newDate = incrementDay(selectedDate.value, WEEKDAYS * direction);
	selectedDate.setState(newDate);
};

const updateMonthYearLabels = (
	date: Date,
	dateFormatter: DateFormatter
): void => {
	const parentElem = document.querySelector("header");
	if (parentElem) {
		const label = parentElem.querySelector("span") as HTMLSpanElement;
		label.innerText = dateFormatter.getMonthYearLabel(date);
	}
};

export const init = (dateFormatter: DateFormatter) => {
	const buttonToday = document.querySelector("#button_today");
	const headerControlsPrev = document.querySelector("#headerControls_prev");
	const headerControlsNext = document.querySelector("#headerControls_next");
	const localeSelector = document.querySelector("#localeSelector");

	buttonToday?.addEventListener("click", () => {
		selectedDate.setState(getToday());
	});

	headerControlsPrev?.addEventListener("click", () => {
		handleNextPrevClick(-1);
	});

	headerControlsNext?.addEventListener("click", () => {
		handleNextPrevClick(1);
	});

	localeSelector?.addEventListener("change", (e) => {
		setLocale((e.target as HTMLInputElement)!.value as LocaleType);
		localeState.setState(getLocale());
	});

	const onLocaleChange = () => {
		updateMonthYearLabels(selectedDate.value, dateFormatter);
	};

	localeState.addListener(onLocaleChange);
	selectedDate.addListener((stateValue: Date) =>
		updateMonthYearLabels(stateValue, dateFormatter)
	);

	updateMonthYearLabels(selectedDate.value, dateFormatter);
};
