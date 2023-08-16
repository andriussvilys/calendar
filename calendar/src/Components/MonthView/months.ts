import { DateFormatter } from "../../Utils/dateFormatter.js";
import {
	isSameDate,
	getToday,
	WEEKDAYS,
	incrementMonth,
} from "../../Utils/dateManipulation.js";
import { localeState, selectedDate, selectedMonth } from "../../Utils/state.js";

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

const createWeekDayLabels = (
	date: Date,
	dateFormatter: DateFormatter
): HTMLElement => {
	const container = document.querySelector(
		".monthView-weekDayNames"
	) as HTMLDivElement;
	container.innerHTML = "";

	dateFormatter.getWeekDayLabels(date).forEach((label) => {
		const span = document.createElement("span");
		span.innerText = label.slice(0, 1);
		container.appendChild(span);
	});

	return container;
};

const generateDayCell = (date: Date, dateFormatter: DateFormatter) => {
	const container = document.createElement("div");
	container.className = `container monthView-cell`;

	const button = document.createElement("button");
	button.className = `button button_round monthView-button ${
		isSameDate(date, getToday()) ? "button_today" : ""
	}`;

	button.innerText = dateFormatter.getDate(date);

	button.dataset.timestamp = date.valueOf().toString();

	button.addEventListener("click", (e) =>
		onMonthButtonClick(e.target as HTMLElement)
	);

	container.appendChild(button);

	return container;
};

export const switchMonth = (newDate: Date, dateFormatter: DateFormatter) => {
	const months = document.querySelector("#month");
	if (months) {
		months.innerHTML = "";
		const monthView = getMonthViewDays(newDate);

		monthView.forEach((date) => {
			months.appendChild(generateDayCell(date, dateFormatter));
		});
	}
};

const onLocaleChange = (dateFormatter: DateFormatter) => {
	updateMonthYearLabels(selectedDate.value, dateFormatter);
	createWeekDayLabels(selectedDate.value, dateFormatter);
	switchMonth(selectedDate.value, dateFormatter);
};

const updateMonthYearLabels = (date: Date, dateFormatter: DateFormatter) => {
	const parentElem = document.querySelector(".monthView-label");
	if (parentElem) {
		const label = parentElem.querySelector("span") as HTMLSpanElement;
		label.innerText = dateFormatter.getMonthYearLabel(date);
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

const onDateChange = (date: Date, dateFormatter: DateFormatter) => {
	switchMonth(date, dateFormatter);
	toggleSelectedSecondary(date);
	updateMonthYearLabels(date, dateFormatter);
};

const onMonthChange = (date: Date, dateFormatter: DateFormatter) => {
	switchMonth(date, dateFormatter);
	updateMonthYearLabels(date, dateFormatter);
};

export const init = (dateFormatter: DateFormatter) => {
	document.querySelector("#months-next")?.addEventListener("click", () => {
		const nextDate = incrementMonth(selectedMonth.value, +1);
		selectedMonth.setState(nextDate);
	});
	document.querySelector("#months-prev")?.addEventListener("click", () => {
		const nextDate = incrementMonth(selectedMonth.value, -1);
		selectedMonth.setState(nextDate);
	});

	switchMonth(selectedDate.value, dateFormatter);
	createWeekDayLabels(selectedDate.value, dateFormatter);
	updateMonthYearLabels(selectedDate.value, dateFormatter);

	selectedDate.addListener((stateValue: Date) =>
		onDateChange(stateValue, dateFormatter)
	);
	selectedMonth.addListener((stateValue: Date) =>
		onMonthChange(stateValue, dateFormatter)
	);
	localeState.addListener(() => onLocaleChange(dateFormatter));
};
