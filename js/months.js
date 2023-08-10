import { isSameDate, getToday, WEEKDAYS, incrementMonth, } from "./dateManipulation.js";
import { localeState, selectedDate, selectedMonth } from "./state.js";
const CALENDAR_ROWS = 6;
const today = getToday();
const toggleSelectedSecondary = (date) => {
    var _a;
    const buttons = document.querySelectorAll(".monthView-button.selected_secondary");
    buttons.forEach((elem) => {
        elem.classList.remove("selected_secondary");
    });
    (_a = document
        .querySelector(`[data-timestamp='${date.valueOf()}']`)) === null || _a === void 0 ? void 0 : _a.classList.add("selected_secondary");
};
const onMonthButtonClick = (event) => {
    var _a;
    const timestamp = (_a = event === null || event === void 0 ? void 0 : event.dataset) === null || _a === void 0 ? void 0 : _a.timestamp;
    if (timestamp) {
        const newDate = new Date(Number(timestamp));
        selectedDate.setState(newDate);
    }
};
const createWeekDayLabels = (date, dateFormatter) => {
    const container = document.querySelector(".monthView-weekDayNames");
    container.innerHTML = "";
    dateFormatter.getWeekDayLabels(date).forEach((label) => {
        const span = document.createElement("span");
        span.innerText = label.slice(0, 1);
        container.appendChild(span);
    });
    return container;
};
const generateDayCell = (date, dateFormatter) => {
    const container = document.createElement("div");
    container.className = `container monthView-cell`;
    const button = document.createElement("button");
    button.className = `button button_round monthView-button ${isSameDate(date, getToday()) ? "button_today" : ""}`;
    // button.innerText = `${date.getDate()}`;
    button.innerText = dateFormatter.getDate(date);
    button.dataset.timestamp = date.valueOf().toString();
    button.addEventListener("click", (e) => onMonthButtonClick(e.target));
    container.appendChild(button);
    return container;
};
export const switchMonth = (newDate, dateFormatter) => {
    const months = document.querySelector("#month");
    if (months) {
        months.innerHTML = "";
        const monthView = getMonthViewDays(newDate);
        monthView.forEach((date) => {
            months.appendChild(generateDayCell(date, dateFormatter));
        });
    }
};
const onLocaleChange = (dateFormatter) => {
    updateMonthYearLabels(selectedDate.value, dateFormatter);
    createWeekDayLabels(selectedDate.value, dateFormatter);
    switchMonth(selectedDate.value, dateFormatter);
};
const updateMonthYearLabels = (date, dateFormatter) => {
    const parentElem = document.querySelector(".monthView-label");
    if (parentElem) {
        const label = parentElem.querySelector("span");
        label.innerText = dateFormatter.getMonthYearLabel(date);
    }
};
const getMonthViewDays = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const result = [];
    const firstMonthDay = new Date(year, month).getDay();
    //get the day before the first day of current month, ie previous month length
    const prevMonthLength = new Date(year, month, 0).getDate();
    //days before current month
    for (let index = prevMonthLength - 7 + 1 + (7 - firstMonthDay + 1); index < prevMonthLength + 1; index++) {
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
const onDateChange = (date, dateFormatter) => {
    switchMonth(date, dateFormatter);
    toggleSelectedSecondary(date);
    updateMonthYearLabels(date, dateFormatter);
};
const onMonthChange = (date, dateFormatter) => {
    switchMonth(date, dateFormatter);
    updateMonthYearLabels(date, dateFormatter);
};
export const init = (dateFormatter) => {
    var _a, _b;
    (_a = document.querySelector("#months-next")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const nextDate = incrementMonth(selectedMonth.value, +1);
        selectedMonth.setState(nextDate);
    });
    (_b = document.querySelector("#months-prev")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        const nextDate = incrementMonth(selectedMonth.value, -1);
        selectedMonth.setState(nextDate);
    });
    switchMonth(selectedDate.value, dateFormatter);
    createWeekDayLabels(selectedDate.value, dateFormatter);
    updateMonthYearLabels(selectedDate.value, dateFormatter);
    selectedDate.addListener((stateValue) => onDateChange(stateValue, dateFormatter));
    selectedMonth.addListener((stateValue) => onMonthChange(stateValue, dateFormatter));
    localeState.addListener(() => onLocaleChange(dateFormatter));
};
