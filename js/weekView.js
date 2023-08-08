import { isSameDate, isSameWeek, getWeekDates, getToday, HOUR_COUNT, LOCALE, } from "./dateManipulation.js";
import { modalState, selectedDate, storageState } from "./state.js";
import { findEventByTimestamp, removeFormData, findEventById, getEventTimeslot, getEventDuration, getEventCellTimestamp, } from "./database.js";
import { showFormModal } from "./event.js";
export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;
const formatTimeString = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("us-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};
const hideModal = () => {
    const modalContainer = document.querySelector("#eventCardModal");
    modalState.value.classList.add("slideOut_rtl");
    setTimeout(() => {
        modalContainer.classList.add("display-none");
        modalState.value.remove();
        modalState.setState(null);
    }, 400);
};
const showModal = (eventId, eventBubble) => {
    const modalContainer = document.querySelector("#eventCardModal");
    modalContainer.classList.remove("display-none");
    const eventCard = createEventCard(eventId);
    modalContainer.appendChild(eventCard);
    eventCard.classList.add("slideIn_ltr");
    modalState.setState(eventCard);
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
const createEventCard = (eventId) => {
    var _a;
    if (eventId == ((_a = modalState.value) === null || _a === void 0 ? void 0 : _a.dataset.eventId)) {
        return;
    }
    const event = findEventById(eventId);
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
        // container.remove();
        // modalState.setState(null);
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
    const dateString = startDate.toLocaleDateString(LOCALE, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const timeString_start = formatTimeString(event.startTime);
    const timeString_end = formatTimeString(event.endTime);
    date.innerText = `<span>${dateString}</span><span> ⋅ </span><span>${timeString_start} — ${timeString_end}</span>`;
    eventCardData.append(date);
    if (event.description) {
        const description = document.createElement("p");
        description.className = "eventCardData-description";
        description.innerText = event.description;
        eventCardData.append(description);
    }
    container.append(eventCardData);
    return container;
};
const createEventBubble = (timeslotEvents, index) => {
    const event = timeslotEvents[index];
    const container = document.createElement("div");
    container.classList.add("eventBubble-container");
    container.dataset.eventId = event.id;
    const title = document.createElement("span");
    title.classList.add("eventBubble-title");
    title.innerText = event.title + ", ";
    container.append(title);
    const time = document.createElement("span");
    time.innerText = new Date(event.startTime).toTimeString().slice(0, 5);
    time.innerText += "—";
    time.innerText += new Date(event.endTime).toTimeString().slice(0, 5);
    // eventBubble width depends on the number of rightSiblingCount
    const rightSiblingCount = timeslotEvents.slice(index, timeslotEvents.length).length;
    const offset = index * EVENTBUBBLE_OFFSET;
    const widthReduction = Math.max(0, rightSiblingCount - 1) * EVENTBUBBLE_OFFSET;
    container.style.height = `${getEventDuration(event) * EVENTBUBBLE_OFFSET}%`;
    container.style.left = `${offset}%`;
    container.style.width = `${100 - offset - widthReduction}%`;
    container.append(time);
    return container;
};
const createTimeslot = (timeslotArray, index, timestamp) => {
    const timeslotEvents = timeslotArray[index];
    //longest events should appear on left side of timeslot
    // const sorted = sortByKey(timeslotEvents, "duration");
    const sorted = timeslotEvents.sort((a, b) => getEventDuration(b) - getEventDuration(a));
    const container = document.createElement("div");
    container.className = "timeslot";
    sorted.forEach((event, index) => {
        const eventBubble = createEventBubble(sorted, index);
        container.append(eventBubble);
    });
    const prevTimeslotSize = timeslotArray
        .slice(0, index)
        .reduce((acc, prevArray) => {
        return Math.max(acc, prevArray.length);
    }, 0);
    const nextTimeSlotSize = timeslotArray
        .slice(index + 1, 4)
        .reduce((acc, nextArr) => {
        return Math.max(acc, nextArr.length - 1);
    }, 0);
    const offset = Math.max(prevTimeslotSize, nextTimeSlotSize);
    container.style.left = `${prevTimeslotSize * 20}%`;
    container.style.width = `${100 - offset * 20}%`;
    container.style.top = `${index * EVENTBUBBLE_OFFSET}%`;
    container.dataset.timestamp = timestamp;
    return container;
};
const updateDayCell = (cellTimestamp, event) => {
    if (cellTimestamp === getEventCellTimestamp(event)) {
        const oldCell = document.querySelector(`.dayCell[data-timestamp="${cellTimestamp}"]`);
        oldCell.innerHTML = "";
        const newCell = createDayCell(cellTimestamp);
        newCell.querySelectorAll(".timeslot").forEach((timeslot) => {
            oldCell.appendChild(timeslot);
        });
    }
};
const createDayCell = (timestamp) => {
    const cell = document.createElement("div");
    cell.className = "day-border dayCell";
    cell.dataset.timestamp = timestamp;
    const events = findEventByTimestamp(timestamp);
    const timeSlots = [[], [], [], []];
    events.forEach((eventData) => {
        const timeslot = getEventTimeslot(eventData);
        timeSlots[timeslot].push(eventData);
    });
    timeSlots.forEach((timeslotArray, index) => {
        const timeslotTimestamp = new Date(timestamp)
            .setMinutes(index * TIMESLOT_DURATION)
            .valueOf();
        const timeslot = createTimeslot(timeSlots, index, timeslotTimestamp);
        cell.append(timeslot);
    });
    storageState.addListener((state, prev) => {
        updateDayCell(timestamp, state);
    });
    return cell;
};
const createDayColumn = (date) => {
    const today = getToday();
    const columnContainer = document.createElement("div");
    columnContainer.classList.add("weekView-column");
    const headerCell = document.createElement("div");
    headerCell.className = `container header-cell`;
    const headerLabel = document.createElement("div");
    headerLabel.className = "container day-label";
    const weekday = document.createElement("span");
    weekday.className = `${isSameDate(date, today) ? "date_today" : ""}`;
    weekday.innerText = date
        .toLocaleDateString(LOCALE, { weekday: "short" })
        .toUpperCase();
    const button = document.createElement("button");
    button.innerText = date.toLocaleDateString(LOCALE, { day: "numeric" });
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
        const cell = createDayCell(timestamp);
        columnContainer.appendChild(cell);
    }
    return columnContainer;
};
const createHourCell = (date) => {
    let hour = date.getHours() % 12 || 12;
    let meridiam = Math.floor(date.getHours() / 12) == 0 ? "AM" : "PM";
    const container = document.createElement("div");
    container.className = "hour";
    const labelContainer = document.createElement("div");
    labelContainer.className = "hour-labelContainer";
    const labelContent = document.createElement("div");
    labelContent.className = "hour-labelContent";
    const hourSpan = document.createElement("span");
    hourSpan.innerText = hour.toString();
    const spaceSpan = document.createElement("span");
    spaceSpan.innerText = " ";
    const meridiamSpan = document.createElement("span");
    meridiamSpan.innerText = meridiam;
    labelContent.appendChild(hourSpan);
    labelContent.appendChild(spaceSpan);
    labelContent.appendChild(meridiamSpan);
    labelContainer.appendChild(labelContent);
    const hourSeparator = document.createElement("div");
    hourSeparator.className = "hour-separator";
    container.appendChild(labelContainer);
    container.appendChild(hourSeparator);
    return container;
};
const createHoursColumn = () => {
    const container = document.createElement("div");
    container.className = "weekView-column hours";
    const headerCell = document.createElement("div");
    headerCell.className = "hour header-cell";
    const hourSeparator = document.createElement("div");
    hourSeparator.className = "hour-separator";
    headerCell.appendChild(hourSeparator);
    container.appendChild(headerCell);
    for (let index = 1; index < HOUR_COUNT; index++) {
        const cell = createHourCell(new Date(0, 0, 0, index));
        container.appendChild(cell);
    }
    return container;
};
const generateWeekView = (date) => {
    const weekView = document.createElement("div");
    weekView.className = "weekView-main";
    weekView.appendChild(createHoursColumn());
    weekView.addEventListener("click", (e) => {
        const eventTarget = e.target;
        const eventTargetDataset = eventTarget.dataset;
        if (eventTargetDataset.timestamp) {
            showFormModal(new Date(parseInt(eventTargetDataset.timestamp)));
        }
        else if (eventTargetDataset.eventId) {
            showModal(eventTargetDataset.eventId, e.target);
        }
    });
    const weekDates = getWeekDates(date);
    for (const date of weekDates) {
        const column = createDayColumn(date);
        weekView.appendChild(column);
    }
    return weekView;
};
let prevWeekView;
let prevTimeout;
export const switchWeekView = (date, prevDate) => {
    if (prevWeekView) {
        clearTimeout(prevTimeout);
        prevWeekView === null || prevWeekView === void 0 ? void 0 : prevWeekView.remove();
        prevWeekView = null;
    }
    const wrapper = document.querySelector(".weekView-wrapper");
    const weekView_current = document.querySelector(".weekView-main");
    const weekView_new = generateWeekView(date);
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
export const init = () => {
    const modalContainer = document.querySelector("#eventCardModal");
    modalContainer.addEventListener("click", (e) => {
        if (e.target.id === "eventCardModal") {
            hideModal();
        }
    });
    switchWeekView(selectedDate.value, selectedDate.prev);
    selectedDate.addListener(switchWeekView);
};
