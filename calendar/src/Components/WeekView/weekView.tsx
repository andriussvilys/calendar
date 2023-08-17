import {
	isSameDate,
	isSameWeek,
	getWeekDates,
	getToday,
	HOUR_COUNT,
} from "../../Utils/dateManipulation";
import {
	localeState,
	modalState,
	selectedDate,
	storageState,
} from "../../Utils/state";
import {
	filterEventsByTimestamp,
	removeFormData,
	findEventById,
	getEventTimeslot,
	getEventDuration,
	getEventCellTimestamp,
	FormData,
} from "../../Utils/database";
import { showFormModal } from "../EventForm/event";
import { DateFormatter } from "../../Utils/dateFormatter";

import "./weekView.css";

export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;

const hideModal = (): void => {
	const modalContainer = document.querySelector("#eventCardModal");
	modalState.value.classList.add("slideOut_rtl");
	setTimeout(() => {
		modalContainer?.classList.add("display-none");
		modalState.value?.remove();
		modalState.setState(null);
	}, 400);
};

const showEventCardModal = (
	eventId: string,
	dateFormatter: DateFormatter
): void => {
	const modalContainer = document.querySelector("#eventCardModal");
	if (modalContainer) {
		modalContainer?.classList.remove("display-none");
		const eventCard = createEventCard(eventId, dateFormatter);
		if (eventCard) {
			modalContainer.appendChild(eventCard);
			eventCard.classList.add("slideIn_ltr");
			modalState.setState(eventCard);
		}
	}
};

const positionEventCard = (
	eventBubble: HTMLElement,
	eventCard: HTMLElement
): void => {
	modalState.value?.remove();

	const domRect = eventBubble.getBoundingClientRect();
	const eventBubbleLeft = domRect.left;
	const eventBubbleTop = domRect.top;

	const elemCenter = domRect.left + domRect.width / 2;
	const htmlBodyWidth = document
		.querySelector("body")!
		.getBoundingClientRect().width;

	if (elemCenter > htmlBodyWidth / 2) {
		eventCard.classList.add("slideIn_ltr");
		eventCard.style.left = `${
			eventBubbleLeft - eventCard.getBoundingClientRect().width
		}px`;
	} else {
		eventCard.classList.add("slideIn_rtl");
		eventCard.style.left = `${eventBubbleLeft + domRect.width}px`;
	}

	eventCard.style.top = `${eventBubbleTop}px`;
};

const createEventCard = (
	eventId: string,
	dateFormatter: DateFormatter
): HTMLElement | null => {
	if (eventId == modalState.value?.dataset.eventId) {
		return null;
	}

	const event = findEventById(eventId);
	if (event) {
		const container = document.createElement("div") as HTMLDivElement;
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

		const eventTimeRange = dateFormatter.getEventHourRange(
			event.startTime,
			event.endTime
		);

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

const createEventBubble = (
	timeslotEvents: FormData[],
	index: number,
	dateFormatter: DateFormatter
) => {
	const event = timeslotEvents[index];

	const container = document.createElement("div");
	container.classList.add("eventBubble");
	container.dataset.eventId = event.id;

	const title = document.createElement("span");
	title.classList.add("eventBubble-title");
	title.innerText = event.title + ", ";
	container.append(title);

	const time = document.createElement("span");
	time.innerText = dateFormatter.getEventHourRange(
		event.startTime,
		event.endTime
	);

	// eventBubble width depends on the number of rightSiblingCount
	const rightSiblingCount = timeslotEvents.slice(
		index,
		timeslotEvents.length
	).length;

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

const createTimeslot = (
	cellTimeslots: Timeslot[],
	index: number,
	timestamp: number,
	dateFormatter: DateFormatter
): HTMLElement => {
	const container = document.createElement("div");
	container.className = "timeslot";
	container.dataset.timestamp = timestamp.toString();

	const eventBubbleContainer = document.createElement("div");
	eventBubbleContainer.className = "eventBubbleContainer";

	const timeslotInnerContainer = document.createElement("div");
	timeslotInnerContainer.className = "timeslot-innerContainer";
	timeslotInnerContainer.dataset.timestamp = timestamp.toString();

	timeslotInnerContainer.appendChild(eventBubbleContainer);
	container.appendChild(timeslotInnerContainer);

	const timeslot: Timeslot = cellTimeslots[index];

	if (timeslot.length > 0) {
		//longest events should appear on left side of timeslot
		const sorted = timeslot.sort(
			(a, b) => getEventDuration(b) - getEventDuration(a)
		);
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
		eventBubbleContainer.style.width = `${100 - prevTimeslotSize * 20}%`;
	}

	container.style.top = `${index * EVENTBUBBLE_OFFSET}%`;
	return container;
};

const updateDayCell = (
	cellTimestamp: number,
	event: FormData,
	dateFormatter: DateFormatter
) => {
	if (cellTimestamp === getEventCellTimestamp(event)) {
		const oldCell = document.querySelector(
			`.dayCell[data-timestamp="${cellTimestamp}"]`
		);
		if (oldCell) {
			oldCell.innerHTML = "";

			const newCell = createDayCell(cellTimestamp, dateFormatter);
			newCell.querySelectorAll(".timeslot").forEach((timeslot) => {
				oldCell.appendChild(timeslot);
			});
		}
	}
};

type Timeslot = FormData[];

const createDayCell = (
	timestamp: number,
	dateFormatter: DateFormatter
): HTMLElement => {
	const cell = document.createElement("div");
	cell.className = "day-border dayCell";
	cell.dataset.timestamp = timestamp.toString();

	const events = filterEventsByTimestamp(timestamp);
	const timeSlots: Timeslot[] = [[], [], [], []];

	events.forEach((eventData) => {
		const timeslotIndex = getEventTimeslot(eventData);
		timeSlots[timeslotIndex].push(eventData);
	});

	timeSlots.forEach((timeslotArray, index) => {
		const timeslotTimestamp = new Date(timestamp)
			.setMinutes(index * TIMESLOT_DURATION)
			.valueOf();
		const timeslot = createTimeslot(
			timeSlots,
			index,
			timeslotTimestamp,
			dateFormatter
		);
		cell.append(timeslot);
	});

	storageState.addListener(() => {
		updateDayCell(timestamp, storageState.value, dateFormatter);
	});

	return cell;
};

const updateDayLabels = (date: Date, dateFormatter: DateFormatter) => {
	const dayLabels = document.querySelectorAll(".header-cell .day-label > span");
	const weekDayLabels = dateFormatter.getWeekDayLabels(date);
	dayLabels.forEach((label, index) => {
		(label as HTMLSpanElement).innerText = weekDayLabels[index];
	});
	const dayLabelButtons = document.querySelectorAll(".dayLabel-button");
	const weekDates = dateFormatter.getWeekDates(date);
	dayLabelButtons.forEach((button: Element, index: number) => {
		(button as HTMLElement).innerText = weekDates[index];
	});
};

const createDayColumn = (
	date: Date,
	dateFormatter: DateFormatter
): HTMLElement => {
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
	button.className = `button dayLabel-button button_round ${
		isSameDate(date, today) ? "button_today" : ""
	}`;

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

const createWeekView = (
	date: Date,
	dateFormatter: DateFormatter
): HTMLElement => {
	const weekView = document.createElement("div");
	weekView.className = "weekView-main";

	// weekView.appendChild(createHoursColumn(dateFormatter));

	weekView.addEventListener("click", (e) => {
		const eventTarget = e.target as HTMLElement;
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

let prevWeekView: HTMLElement | null;
let prevTimeout: NodeJS.Timeout;

export const switchWeekView = (
	date: Date,
	prevDate: Date,
	dateFormatter: DateFormatter
): void => {
	if (prevWeekView) {
		clearTimeout(prevTimeout);
		prevWeekView?.remove();
		prevWeekView = null;
	}

	const wrapper = document.querySelector(".weekView-wrapper") as HTMLElement;
	const weekView_current = document.querySelector(
		".weekView-main"
	) as HTMLElement;

	const weekView_new = createWeekView(date, dateFormatter);
	wrapper.appendChild(weekView_new);

	if (prevDate && !isSameWeek(date, prevDate)) {
		const slideInClass = date > prevDate ? "slideIn_ltr" : "slideIn_rtl";
		weekView_new.classList.add(slideInClass);
	}

	prevWeekView = weekView_current;
	prevTimeout = setTimeout(() => {
		weekView_current?.remove();
		weekView_new.classList.remove("slideIn_ltr");
		weekView_new.classList.remove("slideIn_rtl");
	}, 200);
};

export const init = (dateFormatter: DateFormatter): void => {
	const modalContainer = document.querySelector("#eventCardModal");

	if (modalContainer) {
		modalContainer.addEventListener("click", (e) => {
			if ((e.target as HTMLElement).id === "eventCardModal") {
				hideModal();
			}
		});
	}

	switchWeekView(selectedDate.value, selectedDate.prev, dateFormatter);
	updateDayLabels(selectedDate.value, dateFormatter);

	localeState.addListener(() => {
		const weekViewMain = document.querySelector(".weekView-main");
		weekViewMain!.innerHTML = "";
		weekViewMain?.appendChild(
			createWeekView(selectedDate.value, dateFormatter)
		);
	});
	selectedDate.addListener((currentState: Date, prevState: Date) =>
		switchWeekView(currentState, prevState, dateFormatter)
	);
};

interface DayCellProps {
	date: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
}

interface TimeSlotProps {
	dateFormatter: DateFormatter;
	date: Date;
	cellTimeslots: FormData[][];
	index: number;
}

interface EventBubbleProps {
	timeslotEvents: FormData[];
	index: number;
	dateFormatter: DateFormatter;
}

const EventBubble = ({
	timeslotEvents,
	index,
	dateFormatter,
}: EventBubbleProps) => {
	const rightSiblingCount = timeslotEvents.slice(
		index,
		timeslotEvents.length
	).length;

	const event: FormData = timeslotEvents[index];

	const columnWidth = 100 / (timeslotEvents.length + 1);
	const offset = index * columnWidth;
	const widthReduction = (Math.max(rightSiblingCount, 1) - 1) * columnWidth;
	const width = 100 - offset - widthReduction;

	const style = {
		height: `${Math.max(getEventDuration(event), 1) * 100}%`,
		left: `${offset}%`,
		width: `${width}%`,
	};

	const eventTime = dateFormatter.getEventHourRange(
		event.startTime,
		event.endTime
	);
	return (
		<div className="eventBubble" data-event-id={event.id} style={style}>
			<span className="eventBubble-title">{event.title}</span>
			<span>{eventTime}</span>
		</div>
	);
};

const TimeSlot = ({
	date,
	dateFormatter,
	cellTimeslots,
	index,
}: TimeSlotProps) => {
	const timeslotTimestamp = date
		.setMinutes(index * TIMESLOT_DURATION)
		.valueOf();

	const timeslot: FormData[] = cellTimeslots[index];
	const sorted = timeslot.sort(
		(a, b) => getEventDuration(b) - getEventDuration(a)
	);
	const prevTimeslotSize = cellTimeslots
		.slice(0, index)
		.reduce((acc, prevArray) => {
			return Math.max(acc, prevArray.length);
		}, 0);

	const style = {
		top: `${index * EVENTBUBBLE_OFFSET}%`,
		left: `${prevTimeslotSize * 20}%`,
		width: `${100 - prevTimeslotSize * 20}%`,
	};
	return (
		<div className="timeslot" data-timestamp={timeslotTimestamp} style={style}>
			<div
				className="timeslot-innerContainer"
				data-timestamp={timeslotTimestamp}
			>
				<div className="eventBubbleContainer" style={style}>
					{sorted.map((event, index) => {
						return (
							<EventBubble
								key={event.id}
								timeslotEvents={sorted}
								index={index}
								dateFormatter={dateFormatter}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const DayCell = ({ date, dateFormatter, events }: DayCellProps) => {
	const timestamp = date.valueOf();
	console.log(date);
	const filteredEvents = events.filter(
		(event) => getEventCellTimestamp(event) == timestamp
	);
	const timeSlots: Timeslot[] = [[], [], [], []];

	console.log({ events });
	filteredEvents.forEach((eventData) => {
		const timeslotIndex = getEventTimeslot(eventData);
		timeSlots[timeslotIndex].push(eventData);
	});
	return (
		<div className="day-border dayCell" data-timestamp={timestamp}>
			{timeSlots.map((timeslot, index) => {
				return (
					<TimeSlot
						key={`timestamp-${index}`}
						cellTimeslots={timeSlots}
						index={index}
						date={date}
						dateFormatter={dateFormatter}
					/>
				);
			})}
		</div>
	);
};

interface DayColumnHeaderProps {
	date: Date;
	dateFormatter: DateFormatter;
}
const DayColumnHeader = ({ date, dateFormatter }: DayColumnHeaderProps) => {
	return (
		<div className="container header-cell">
			<div className="container day-label">
				<span className="">{dateFormatter.getWeekDateLabel(date)}</span>
				<button
					className={`button dayLabel-button button_round ${
						isSameDate(date, getToday()) ? "button_today" : ""
					}`}
				>
					{dateFormatter.getDate(date)}
				</button>
			</div>
			<div className="day-border eventCell_header"></div>
		</div>
	);
};

const DayColumn = ({ date, dateFormatter, events }: DayCellProps) => {
	return (
		<div className="weekView-column">
			<DayColumnHeader date={date} dateFormatter={dateFormatter} />
			{[...Array(HOUR_COUNT).keys()].map((hour) => {
				const dayCellDate = new Date(date);
				dayCellDate.setHours(hour);
				const timestamp = dayCellDate.valueOf();
				return (
					<DayCell
						key={timestamp}
						date={dayCellDate}
						dateFormatter={dateFormatter}
						events={events}
					/>
				);
			})}
		</div>
	);
};

interface HourCellProps {
	timestamp: number;
	dateFormatter: DateFormatter;
}
const HourCell = ({ timestamp, dateFormatter }: HourCellProps) => {
	return (
		<div className="hour">
			<div className="hour-labelContainer">
				<div className="hour-labelContent">
					<span>{dateFormatter.getHour(timestamp)}</span>
					<span> </span>
				</div>
			</div>
			<div className="hour-separator"></div>
		</div>
	);
};
const HourColumn = ({ dateFormatter }: { dateFormatter: DateFormatter }) => {
	return (
		<div className="weekView-column hours">
			<div className="hour header-cell">
				<div className="hour-separator"></div>
			</div>
			{[...Array(HOUR_COUNT - 1).keys()].map((hour) => {
				return (
					<HourCell
						key={new Date(0, 0, 0, hour + 1).valueOf()}
						timestamp={new Date(0, 0, 0, hour + 1).valueOf()}
						dateFormatter={dateFormatter}
					/>
				);
			})}
		</div>
	);
};

interface WeekViewProps {
	selectedDate: Date;
	onLocalStorageChange: Function;
	dateFormatter: DateFormatter;
	events: FormData[];
}
const WeekView = ({
	selectedDate,
	dateFormatter,
	onLocalStorageChange,
	events,
}: WeekViewProps) => {
	const weekDates = getWeekDates(selectedDate);

	return (
		<div className="weekView-main">
			<HourColumn dateFormatter={dateFormatter} />
			{weekDates.map((date) => {
				return (
					<DayColumn
						key={date.valueOf()}
						date={date}
						dateFormatter={dateFormatter}
						events={events}
					/>
				);
			})}
		</div>
	);
};

export default WeekView;
