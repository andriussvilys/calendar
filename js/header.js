import { getToday, incrementDay, WEEKDAYS, LOCALE, } from "./dateManipulation.js";
import { selectedDate } from "./state.js";
const button_today = document.querySelector("#button_today");
const headerControls_prev = document.querySelector("#headerControls_prev");
const headerControls_next = document.querySelector("#headerControls_next");
button_today.addEventListener("click", () => {
    selectedDate.setState(getToday());
});
headerControls_prev.addEventListener("click", () => {
    handleNextPrevClick(-1);
});
headerControls_next.addEventListener("click", () => {
    handleNextPrevClick(1);
});
const handleNextPrevClick = (direction) => {
    const newDate = incrementDay(selectedDate.value, WEEKDAYS * direction);
    selectedDate.setState(newDate);
};
const updateMonthYearLabels = (date) => {
    const parentElem = document.querySelector("header");
    const monthLabel = parentElem.querySelector("[data-calendarLabel='month']");
    const yearLabel = parentElem.querySelector("[data-calendarLabel='year']");
    monthLabel.innerHTML = date.toLocaleDateString(LOCALE, { month: "long" });
    yearLabel.innerHTML = date.getFullYear();
};
export const init = () => {
    selectedDate.addListener(updateMonthYearLabels);
    updateMonthYearLabels(selectedDate.value);
};
