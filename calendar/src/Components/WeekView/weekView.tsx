import {
	isSameDate,
	getWeekDates,
	getToday,
	HOUR_COUNT,
} from "../../Utils/dateManipulation";
import {
	getEventTimeslot,
	getEventDuration,
	getEventCellTimestamp,
	FormData,
} from "../../Utils/database";
import { DateFormatter } from "../../Utils/dateFormatter";

import "./weekView.css";

import EventForm, { EventFormProps } from "../EventForm/EventForm";
import EventCard from "./EventCard";

export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;

interface DayCellProps {
	date: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
	onModalBodyChange: Function;
	hideModal: Function;
	removeFromLocalStorage: Function;
}

interface TimeSlotProps {
	dateFormatter: DateFormatter;
	date: Date;
	cellTimeslots: FormData[][];
	index: number;
	onModalBodyChange: Function;
	hideModal: Function;
	removeFromLocalStorage: Function;
}

interface EventBubbleProps {
	timeslotEvents: FormData[];
	index: number;
	dateFormatter: DateFormatter;
	onModalBodyChange: Function;
	hideModal: Function;
	removeFromLocalStorage: Function;
}

const EventBubble = ({
	timeslotEvents,
	index,
	dateFormatter,
	onModalBodyChange,
	hideModal,
	removeFromLocalStorage,
}: EventBubbleProps) => {
	const rightSiblingCount = timeslotEvents.slice(
		index,
		timeslotEvents.length
	).length;

	const event: FormData = timeslotEvents[index];

	const columnWidth = 100 / (timeslotEvents.length + 1);
	const offset = index * columnWidth;
	const widthReduction = (Math.max(rightSiblingCount, 1) - 1) * columnWidth;
	// const widthReduction = 0;
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
		<div
			className="eventBubble"
			data-event-id={event.id}
			style={style}
			onClick={() =>
				onModalBodyChange(
					<EventCard
						event={event}
						dateFormatter={dateFormatter}
						hideModal={hideModal}
						removeFromLocalStorage={removeFromLocalStorage}
					/>
				)
			}
		>
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
	onModalBodyChange,
	hideModal,
	removeFromLocalStorage,
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

	return (
		<div
			className="timeslot"
			data-timestamp={timeslotTimestamp}
			style={{ top: `${index * EVENTBUBBLE_OFFSET}%` }}
		>
			<div
				className="timeslot-innerContainer"
				data-timestamp={timeslotTimestamp}
			>
				<div
					className="eventBubbleContainer"
					style={{
						left: `${prevTimeslotSize * 20}%`,
						width: timeslot.length > 0 ? `${100 - prevTimeslotSize * 20}%` : 0,
					}}
				>
					{sorted.map((event, index) => {
						return (
							<EventBubble
								key={event.id}
								timeslotEvents={sorted}
								index={index}
								dateFormatter={dateFormatter}
								onModalBodyChange={onModalBodyChange}
								hideModal={hideModal}
								removeFromLocalStorage={removeFromLocalStorage}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const DayCell = ({
	date,
	dateFormatter,
	events,
	onModalBodyChange,
	hideModal,
	removeFromLocalStorage,
}: DayCellProps) => {
	const timestamp = date.valueOf();
	const filteredEvents = events.filter(
		(event) => getEventCellTimestamp(event) == timestamp
	);
	const timeSlots: FormData[][] = [[], [], [], []];

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
						onModalBodyChange={onModalBodyChange}
						hideModal={hideModal}
						removeFromLocalStorage={removeFromLocalStorage}
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

const DayColumn = ({
	date,
	dateFormatter,
	events,
	onModalBodyChange,
	hideModal,
	removeFromLocalStorage,
}: DayCellProps) => {
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
						onModalBodyChange={onModalBodyChange}
						hideModal={hideModal}
						removeFromLocalStorage={removeFromLocalStorage}
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

const handleWeekViewClick = (
	event: any,
	openModal: Function,
	hideModal: Function,
	saveToLocalStorage: Function
) => {
	const eventTarget = event.nativeEvent.target as HTMLElement;
	console.log(eventTarget);
	const eventTargetDataset = eventTarget.dataset;
	if (eventTargetDataset.timestamp) {
		const timestamp: number = Number.parseInt(
			event.nativeEvent.target.dataset.timestamp
		);
		const eventForm = (
			<EventForm
				key={Date.now().valueOf()}
				hideModal={hideModal}
				saveToLocalStorage={saveToLocalStorage}
				timestamp={timestamp}
			/>
		);
		openModal(eventForm);
	}
};

interface WeekViewProps extends EventFormProps {
	selectedDate: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
	openModal: Function;
	removeFromLocalStorage: Function;
}
const WeekView = ({
	selectedDate,
	dateFormatter,
	events,
	openModal,
	hideModal,
	saveToLocalStorage,
	removeFromLocalStorage,
}: WeekViewProps) => {
	const weekDates = getWeekDates(selectedDate);

	return (
		<div
			className="weekView-main"
			onClick={(e) => {
				handleWeekViewClick(e, openModal, hideModal, saveToLocalStorage);
			}}
		>
			<HourColumn dateFormatter={dateFormatter} />
			{weekDates.map((date) => {
				return (
					<DayColumn
						key={date.valueOf()}
						date={date}
						dateFormatter={dateFormatter}
						events={events}
						onModalBodyChange={openModal}
						hideModal={hideModal}
						removeFromLocalStorage={removeFromLocalStorage}
					/>
				);
			})}
		</div>
	);
};

export default WeekView;
