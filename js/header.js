import { getLocale, getToday, incrementDay, setLocale, WEEKDAYS, } from "./dateManipulation.js";
import { localeState, selectedDate } from "./state.js";
const handleNextPrevClick = (direction) => {
    const newDate = incrementDay(selectedDate.value, WEEKDAYS * direction);
    selectedDate.setState(newDate);
};
const updateMonthYearLabels = (date, dateFormatter) => {
    const parentElem = document.querySelector("header");
    if (parentElem) {
        const label = parentElem.querySelector("span");
        label.innerText = dateFormatter.getMonthYearLabel(date);
    }
};
export const init = (dateFormatter) => {
    const button_today = document.querySelector("#button_today");
    const headerControls_prev = document.querySelector("#headerControls_prev");
    const headerControls_next = document.querySelector("#headerControls_next");
    const localeSelector = document.querySelector("#localeSelector");
    button_today === null || button_today === void 0 ? void 0 : button_today.addEventListener("click", () => {
        selectedDate.setState(getToday());
    });
    headerControls_prev === null || headerControls_prev === void 0 ? void 0 : headerControls_prev.addEventListener("click", () => {
        handleNextPrevClick(-1);
    });
    headerControls_next === null || headerControls_next === void 0 ? void 0 : headerControls_next.addEventListener("click", () => {
        handleNextPrevClick(1);
    });
    localeSelector === null || localeSelector === void 0 ? void 0 : localeSelector.addEventListener("change", (e) => {
        setLocale(e.target.value);
        localeState.setState(getLocale());
    });
    const onLocaleChange = () => {
        updateMonthYearLabels(selectedDate.value, dateFormatter);
    };
    localeState.addListener(onLocaleChange);
    selectedDate.addListener((stateValue) => updateMonthYearLabels(stateValue, dateFormatter));
    updateMonthYearLabels(selectedDate.value, dateFormatter);
};
