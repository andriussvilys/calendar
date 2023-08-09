import {
	isSameDate,
	getToday,
	WEEKDAYS,
	incrementMonth,
	LOCALE,
} from "./dateManipulation.js";
import { selectedDate, selectedMonth } from "./state.js";

const CALENDAR_ROWS = 6;

const today = getToday();

const toggleSelectedSecondary = (date: Date) => {
	const buttons = document.querySelectorAll(
		".monthView-button.selected_secondary"
	);
	buttons.forEach((elem) => {
		elem.classList.remove("selected_secondary");
	});
	document
		.querySelector(`[data-timestamp='${date.valueOf()}']`)
		?.classList.add("selected_secondary");
};

const onMonthButtonClick = (event: HTMLElement) => {
	const timestamp = event?.dataset?.timestamp;
	if (timestamp) {
		const newDate = new Date(Number(timestamp));
		selectedDate.setState(newDate);
	}
};

const generateDayCell = (date: Date) => {
	const container = document.createElement("div");
	container.className = `container monthView-cell`;

	const button = document.createElement("button");
	button.className = `button button_round monthView-button ${
		isSameDate(date, getToday()) ? "button_today" : ""
	}`;

	button.innerText = `${date.getDate()}`;

	button.dataset.timestamp = date.valueOf().toString();

	button.addEventListener("click", (e) =>
		onMonthButtonClick(e.target as HTMLElement)
	);

	container.appendChild(button);

	return container;
};

export const switchMonth = (newDate: Date) => {
	const months = document.querySelector("#month");
	if (months) {
		months.innerHTML = "";
		const monthView = getMonthViewDays(newDate);

		monthView.forEach((date) => {
			months.appendChild(generateDayCell(date));
		});
	}
};

const updateMonthYearLabels = (date: Date) => {
	const parentElem = document.querySelector(".monthView-label");
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

const getMonthViewDays = (newDate: Date): Date[] => {
	const year = newDate.getFullYear();
	const month = newDate.getMonth();

	const result: Date[] = [];

	const firstMonthDay = new Date(year, month).getDay();

	//get the day before the first day of current month, ie previous month length
	const prevMonthLength = new Date(year, month, 0).getDate();

	//days before current month
	for (
		let index = prevMonthLength - 7 + 1 + (7 - firstMonthDay + 1);
		index < prevMonthLength + 1;
		index++
	) {
		result.push(new Date(year, month - 1, index));
	}

	//current Month
	const monthLength = new Date(year, month + 1, 0).getDate();

	for (let index = 1; index < monthLength + 1; index++) {
		result.push(new Date(year, month, index));
	}

	const remainder = WEEKDAYS * CALENDAR_ROWS - result.length;

	//days after current month
	for (let index = 1; index < remainder + 1; index++) {
		result.push(new Date(year, month + 1, index));
	}

	return result;
};

const onDateChange = (date: Date) => {
	switchMonth(date);
	toggleSelectedSecondary(date);
	updateMonthYearLabels(date);
};

const onMonthChange = (date: Date) => {
	switchMonth(date);
	updateMonthYearLabels(date);
};

export const init = () => {
	document.querySelector("#months-next")?.addEventListener("click", () => {
		const nextDate = incrementMonth(selectedMonth.value, +1);
		selectedMonth.setState(nextDate);
	});
	document.querySelector("#months-prev")?.addEventListener("click", () => {
		const nextDate = incrementMonth(selectedMonth.value, -1);
		selectedMonth.setState(nextDate);
	});

	selectedDate.addListener(onDateChange);
	selectedMonth.addListener(onMonthChange);

	switchMonth(selectedDate.value);
	updateMonthYearLabels(selectedDate.value);
};