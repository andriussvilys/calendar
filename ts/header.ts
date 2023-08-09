import {
	getToday,
	incrementDay,
	WEEKDAYS,
	LOCALE,
} from "./dateManipulation.js";
import { selectedDate } from "./state.js";

const handleNextPrevClick = (direction: number): void => {
	const newDate = incrementDay(selectedDate.value, WEEKDAYS * direction);
	selectedDate.setState(newDate);
};

const updateMonthYearLabels = (date: Date): void => {
	const parentElem = document.querySelector("header");
	if (parentElem) {
		const monthLabel = parentElem.querySelector(
			"[data-calendarLabel='month']"
		) as HTMLSpanElement;
		const yearLabel = parentElem.querySelector(
			"[data-calendarLabel='year']"
		) as HTMLSpanElement;

		monthLabel.innerText = date.toLocaleDateString(LOCALE, { month: "long" });
		yearLabel.innerHTML = date.getFullYear().toString();
	}
};

export const init = () => {
	const button_today = document.querySelector("#button_today");
	const headerControls_prev = document.querySelector("#headerControls_prev");
	const headerControls_next = document.querySelector("#headerControls_next");

	button_today?.addEventListener("click", () => {
		selectedDate.setState(getToday());
	});

	headerControls_prev?.addEventListener("click", () => {
		handleNextPrevClick(-1);
	});

	headerControls_next?.addEventListener("click", () => {
		handleNextPrevClick(1);
	});
	selectedDate.addListener(updateMonthYearLabels);
	updateMonthYearLabels(selectedDate.value);
};
