import { isSameDate, isSameWeek, getWeekDates, getToday, HOUR_COUNT, } from "./dateManipulation.js";
import { localeState, modalState, selectedDate, storageState, } from "./state.js";
import { filterEventsByTimestamp, removeFormData, findEventById, getEventTimeslot, getEventDuration, getEventCellTimestamp, } from "./database.js";
import { showFormModal } from "./event.js";
export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;
const hideModal = () => {
    const modalContainer = document.querySelector("#eventCardModal");
    modalState.value.classList.add("slideOut_rtl");
    setTimeout(() => {
        var _a;
        modalContainer === null || modalContainer === void 0 ? void 0 : modalContainer.classList.add("display-none");
        (_a = modalState.value) === null || _a === void 0 ? void 0 : _a.remove();
        modalState.setState(null);
    }, 400);
};
const showEventCardModal = (eventId, dateFormatter) => {
    const modalContainer = document.querySelector("#eventCardModal");
    if (modalContainer) {
        modalContainer === null || modalContainer === void 0 ? void 0 : modalContainer.classList.remove("display-none");
        const eventCard = createEventCard(eventId, dateFormatter);
        if (eventCard) {
            modalContainer.appendChild(eventCard);
            eventCard.classList.add("slideIn_ltr");
            modalState.setState(eventCard);
        }
    }
};
const positionEventCard = (eventBubble, eventCard) => {
    var _a;
    (_a = modalState.value) === null || _a === void 0 ? void 0 : _a.remove();
    const domRect = eventBubble.getBoundingClientRect();
    const eventBubbleLeft = domRect.left;
    const eventBubbleTop = domRect.top;
    const elemCenter = domRect.left + domRect.width / 2;
    const htmlBodyWidth = document
        .querySelector("body")
        .getBoundingClientRect().width;
    if (elemCenter > htmlBodyWidth / 2) {
        eventCard.classList.add("slideIn_ltr");
        eventCard.style.left = `${eventBubbleLeft - eventCard.getBoundingClientRect().width}px`;
    }
    else {
        eventCard.classList.add("slideIn_rtl");
        eventCard.style.left = `${eventBubbleLeft + domRect.width}px`;
    }
    eventCard.style.top = `${eventBubbleTop}px`;
};
const createEventCard = (eventId, dateFormatter) => {
    var _a;
    if (eventId == ((_a = modalState.value) === null || _a === void 0 ? void 0 : _a.dataset.eventId)) {
        return null;
    }
    const event = findEventById(eventId);
    if (event) {
        const container = document.createElement("div");
        container.className = "container eventCard";
        container.dataset.eventId = eventId;
        const controls = document.createElement("div");
        controls.className = "container eventCard-controls";
        const eventCardButtonClassList = "button button_round eventCard-button";
        const deleteButton = document.createElement("button");
        deleteButton.className = eventCardButtonClassList;
        const deleteIcon = document.createElement("img");
        deleteIcon.src = "../images/delete_FILL0_wght400_GRAD0_opsz48.svg";
        deleteButton.append(deleteIcon);
        deleteButton.addEventListener("click", () => {
            removeFormData(eventId);
            hideModal();
        });
        controls.append(deleteButton);
        const closeButton = document.createElement("button");
        closeButton.className = eventCardButtonClassList;
        const closeIcon = document.createElement("img");
        closeIcon.src = "../images/close_FILL0_wght400_GRAD0_opsz48.svg";
        closeButton.append(closeIcon);
        closeButton.addEventListener("click", () => {
            hideModal();
        });
        controls.append(closeButton);
        container.append(controls);
        const eventCardData = document.createElement("div");
        eventCardData.className = "container eventCardData";
        const title = document.createElement("h2");
        title.innerText = event.title;
        eventCardData.append(title);
        const date = document.createElement("p");
        const startDate = new Date(event.startTime);
        const dateString = dateFormatter.getEventDate(startDate);
        const eventTimeRange = dateFormatter.getEventHourRange(event.startTime, event.endTime);
        date.innerHTML = `<span>${dateString}</span><span> ⋅ </span>${eventTimeRange}</span>`;
        eventCardData.append(date);
        if (event.description) {
            const description = document.createElement("p");
            description.className = "eventCardData-description";
            description.innerText = event.description;
            eventCardData.append(description);
        }
        container.append(eventCardData);
        return container;
    }
    return null;
};
const createEventBubble = (timeslotEvents, index, dateFormatter) => {
    const event = timeslotEvents[index];
    const container = document.createElement("div");
    container.classList.add("eventBubble-container");
    container.dataset.eventId = event.id;
    const title = document.createElement("span");
    title.classList.add("eventBubble-title");
    title.innerText = event.title + ", ";
    container.append(title);
    const time = document.createElement("span");
    time.innerText = dateFormatter.getEventHourRange(event.startTime, event.endTime);
    // eventBubble width depends on the number of rightSiblingCount
    const rightSiblingCount = timeslotEvents.slice(index, timeslotEvents.length).length;
    const columnWidth = 100 / (timeslotEvents.length + 1);
    const offset = index * columnWidth;
    const widthReduction = (Math.max(rightSiblingCount, 1) - 1) * columnWidth;
    const width = 100 - offset - widthReduction;
    container.style.height = `${Math.max(getEventDuration(event), 1) * 100}%`;
    container.style.left = `${offset}%`;
    container.style.width = `${width}%`;
    container.append(time);
    container.addEventListener("click", (e) => {
        showEventCardModal(event.id, dateFormatter);
    });
    return container;
};
const createTimeslot = (cellTimeslots, index, timestamp, dateFormatter) => {
    const container = document.createElement("div");
    container.className = "timeslot";
    container.dataset.timestamp = timestamp.toString();
    const eventBubbleContainer = document.createElement("div");
    eventBubbleContainer.className = "eventBubbleContainer";
    const eventBubbleWrapper = document.createElement("div");
    eventBubbleWrapper.className = "eventBubbleWrapper";
    eventBubbleWrapper.dataset.timestamp = timestamp.toString();
    eventBubbleWrapper.appendChild(eventBubbleContainer);
    container.appendChild(eventBubbleWrapper);
    const timeslot = cellTimeslots[index];
    if (timeslot.length > 0) {
        //longest events should appear on left side of timeslot
        const sorted = timeslot.sort((a, b) => getEventDuration(b) - getEventDuration(a));
        sorted.forEach((event, index) => {
            const eventBubble = createEventBubble(sorted, index, dateFormatter);
            eventBubbleContainer.append(eventBubble);
        });
        const prevTimeslotSize = cellTimeslots
            .slice(0, index)
            .reduce((acc, prevArray) => {
            return Math.max(acc, prevArray.length);
        }, 0);
        const nextTimeSlotSize = cellTimeslots
            .slice(index + 1, 4)
            .reduce((acc, nextArr) => {
            return Math.max(acc, nextArr.length - 1);
        }, 0);
        const offset = Math.max(prevTimeslotSize, nextTimeSlotSize);
        eventBubbleContainer.style.left = `${prevTimeslotSize * 20}%`;
        // eventBubbleContainer.style.width = `${100 - offset * 20}%`;
        eventBubbleContainer.style.width = `${100 - prevTimeslotSize * 20}%`;
    }
    container.style.top = `${index * EVENTBUBBLE_OFFSET}%`;
    return container;
};
const updateDayCell = (cellTimestamp, event, dateFormatter) => {
    if (cellTimestamp === getEventCellTimestamp(event)) {
        const oldCell = document.querySelector(`.dayCell[data-timestamp="${cellTimestamp}"]`);
        if (oldCell) {
            oldCell.innerHTML = "";
            const newCell = createDayCell(cellTimestamp, dateFormatter);
            newCell.querySelectorAll(".timeslot").forEach((timeslot) => {
                oldCell.appendChild(timeslot);
            });
        }
    }
};
const createDayCell = (timestamp, dateFormatter) => {
    const cell = document.createElement("div");
    cell.className = "day-border dayCell";
    cell.dataset.timestamp = timestamp.toString();
    const events = filterEventsByTimestamp(timestamp);
    const timeSlots = [[], [], [], []];
    events.forEach((eventData) => {
        const timeslotIndex = getEventTimeslot(eventData);
        timeSlots[timeslotIndex].push(eventData);
    });
    timeSlots.forEach((timeslotArray, index) => {
        const timeslotTimestamp = new Date(timestamp)
            .setMinutes(index * TIMESLOT_DURATION)
            .valueOf();
        const timeslot = createTimeslot(timeSlots, index, timeslotTimestamp, dateFormatter);
        cell.append(timeslot);
    });
    storageState.addListener(() => {
        updateDayCell(timestamp, storageState.value, dateFormatter);
    });
    return cell;
};
const updateDayLabels = (date, dateFormatter) => {
    const dayLabels = document.querySelectorAll(".header-cell .day-label > span");
    const weekDayLabels = dateFormatter.getWeekDayLabels(date);
    dayLabels.forEach((label, index) => {
        label.innerText = weekDayLabels[index];
    });
    const dayLabelButtons = document.querySelectorAll(".header-cell .day-label > button");
    const weekDates = dateFormatter.getWeekDates(date);
    dayLabelButtons.forEach((button, index) => {
        button.innerText = weekDates[index];
    });
};
const createDayColumn = (date, dateFormatter) => {
    const today = getToday();
    const columnContainer = document.createElement("div");
    columnContainer.classList.add("weekView-column");
    const headerCell = document.createElement("div");
    headerCell.className = `container header-cell`;
    const headerLabel = document.createElement("div");
    headerLabel.className = "container day-label";
    const weekday = document.createElement("span");
    weekday.className = `${isSameDate(date, today) ? "date_today" : ""}`;
    weekday.innerText = dateFormatter.getWeekDateLabel(date);
    const button = document.createElement("button");
    button.innerText = dateFormatter.getDate(date);
    button.className = `button weekView-button button_round ${isSameDate(date, today) ? "button_today" : ""}`;
    const eventCell = document.createElement("div");
    eventCell.className = "day-border eventCell_header";
    headerLabel.appendChild(weekday);
    headerLabel.appendChild(button);
    headerCell.appendChild(headerLabel);
    headerCell.appendChild(eventCell);
    columnContainer.appendChild(headerCell);
    for (let index = 0; index < HOUR_COUNT; index++) {
        const timestamp = new Date(date).setHours(index).valueOf();
        const cell = createDayCell(timestamp, dateFormatter);
        columnContainer.appendChild(cell);
    }
    return columnContainer;
};
const createHourCell = (timestamp, dateFormatter) => {
    // let hour = date.getHours() % 12 || 12;
    // let meridiam = Math.floor(date.getHours() / 12) == 0 ? "AM" : "PM";
    const container = document.createElement("div");
    container.className = "hour";
    const labelContainer = document.createElement("div");
    labelContainer.className = "hour-labelContainer";
    const labelContent = document.createElement("div");
    labelContent.className = "hour-labelContent";
    // const hourSpan = document.createElement("span");
    // hourSpan.innerText = hour.toString();
    const hourSpan = document.createElement("span");
    hourSpan.innerText = dateFormatter.getHour(timestamp);
    const spaceSpan = document.createElement("span");
    spaceSpan.innerText = " ";
    // const meridiamSpan = document.createElement("span");
    // meridiamSpan.innerText = meridiam;
    labelContent.appendChild(hourSpan);
    labelContent.appendChild(spaceSpan);
    // labelContent.appendChild(meridiamSpan);
    labelContainer.appendChild(labelContent);
    const hourSeparator = document.createElement("div");
    hourSeparator.className = "hour-separator";
    container.appendChild(labelContainer);
    container.appendChild(hourSeparator);
    return container;
};
const createHoursColumn = (dateFormatter) => {
    const container = document.createElement("div");
    container.className = "weekView-column hours";
    const headerCell = document.createElement("div");
    headerCell.className = "hour header-cell";
    const hourSeparator = document.createElement("div");
    hourSeparator.className = "hour-separator";
    headerCell.appendChild(hourSeparator);
    container.appendChild(headerCell);
    for (let index = 1; index < HOUR_COUNT; index++) {
        const cell = createHourCell(new Date(0, 0, 0, index).valueOf(), dateFormatter);
        container.appendChild(cell);
    }
    return container;
};
const createWeekView = (date, dateFormatter) => {
    const weekView = document.createElement("div");
    weekView.className = "weekView-main";
    weekView.appendChild(createHoursColumn(dateFormatter));
    weekView.addEventListener("click", (e) => {
        const eventTarget = e.target;
        const eventTargetDataset = eventTarget.dataset;
        if (eventTargetDataset.timestamp) {
            showFormModal(new Date(parseInt(eventTargetDataset.timestamp)));
        }
    });
    const weekDates = getWeekDates(date);
    for (const date of weekDates) {
        const column = createDayColumn(date, dateFormatter);
        weekView.appendChild(column);
    }
    return weekView;
};
let prevWeekView;
let prevTimeout;
export const switchWeekView = (date, prevDate, dateFormatter) => {
    if (prevWeekView) {
        clearTimeout(prevTimeout);
        prevWeekView === null || prevWeekView === void 0 ? void 0 : prevWeekView.remove();
        prevWeekView = null;
    }
    const wrapper = document.querySelector(".weekView-wrapper");
    const weekView_current = document.querySelector(".weekView-main");
    const weekView_new = createWeekView(date, dateFormatter);
    wrapper.appendChild(weekView_new);
    if (prevDate && !isSameWeek(date, prevDate)) {
        const slideInClass = date > prevDate ? "slideIn_ltr" : "slideIn_rtl";
        weekView_new.classList.add(slideInClass);
    }
    prevWeekView = weekView_current;
    prevTimeout = setTimeout(() => {
        weekView_current === null || weekView_current === void 0 ? void 0 : weekView_current.remove();
        weekView_new.classList.remove("slideIn_ltr");
        weekView_new.classList.remove("slideIn_rtl");
    }, 200);
};
export const init = (dateFormatter) => {
    const modalContainer = document.querySelector("#eventCardModal");
    if (modalContainer) {
        modalContainer.addEventListener("click", (e) => {
            if (e.target.id === "eventCardModal") {
                hideModal();
            }
        });
    }
    switchWeekView(selectedDate.value, selectedDate.prev, dateFormatter);
    updateDayLabels(selectedDate.value, dateFormatter);
    localeState.addListener(() => {
        const weekViewMain = document.querySelector(".weekView-main");
        weekViewMain.innerHTML = "";
        weekViewMain === null || weekViewMain === void 0 ? void 0 : weekViewMain.appendChild(createWeekView(selectedDate.value, dateFormatter));
    });
    selectedDate.addListener((currentState, prevState) => switchWeekView(currentState, prevState, dateFormatter));
};
