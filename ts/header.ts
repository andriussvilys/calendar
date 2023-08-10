import { DateFormatter } from "./date-formatter.js";
import {
	getLocale,
	getToday,
	incrementDay,
	setLocale,
	WEEKDAYS,
	localeType,
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
	const button_today = document.querySelector("#button_today");
	const headerControls_prev = document.querySelector("#headerControls_prev");
	const headerControls_next = document.querySelector("#headerControls_next");
	const localeSelector = document.querySelector("#localeSelector");

	button_today?.addEventListener("click", () => {
		selectedDate.setState(getToday());
	});

	headerControls_prev?.addEventListener("click", () => {
		handleNextPrevClick(-1);
	});

	headerControls_next?.addEventListener("click", () => {
		handleNextPrevClick(1);
	});

	localeSelector?.addEventListener("change", (e) => {
		setLocale((e.target as HTMLInputElement)!.value as localeType);
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
