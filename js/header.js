import { getToday, incrementDay, WEEKDAYS, LOCALE, } from "./dateManipulation.js";
import { selectedDate } from "./state.js";
const handleNextPrevClick = (direction) => {
    const newDate = incrementDay(selectedDate.value, WEEKDAYS * direction);
    selectedDate.setState(newDate);
};
const updateMonthYearLabels = (date) => {
    const parentElem = document.querySelector("header");
    if (parentElem) {
        const monthLabel = parentElem.querySelector("[data-calendarLabel='month']");
        const yearLabel = parentElem.querySelector("[data-calendarLabel='year']");
        monthLabel.innerText = date.toLocaleDateString(LOCALE, { month: "long" });
        yearLabel.innerHTML = date.getFullYear().toString();
    }
};
export const init = () => {
    const button_today = document.querySelector("#button_today");
    const headerControls_prev = document.querySelector("#headerControls_prev");
    const headerControls_next = document.querySelector("#headerControls_next");
    button_today === null || button_today === void 0 ? void 0 : button_today.addEventListener("click", () => {
        selectedDate.setState(getToday());
    });
    headerControls_prev === null || headerControls_prev === void 0 ? void 0 : headerControls_prev.addEventListener("click", () => {
        handleNextPrevClick(-1);
    });
    headerControls_next === null || headerControls_next === void 0 ? void 0 : headerControls_next.addEventListener("click", () => {
        handleNextPrevClick(1);
    });
    selectedDate.addListener(updateMonthYearLabels);
    updateMonthYearLabels(selectedDate.value);
};
