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
import deleteIcon from "../../images/delete_FILL0_wght400_GRAD0_opsz48.svg";
import closeIcon from "../../images/close_FILL0_wght400_GRAD0_opsz48.svg";
import { Fragment } from "react";

export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;

interface EventCardProps {
	event: FormData;
	dateFormatter: DateFormatter;
}
const EventCard = ({ event, dateFormatter }: EventCardProps) => {
	const dateString = dateFormatter.getEventDate(new Date(event.startTime));

	const eventTimeRange = dateFormatter.getEventHourRange(
		event.startTime,
		event.endTime
	);
	return (
		// <div
		// 	className="container eventCard slideIn_ltr"
		// 	data-event-id="a4110264-03f2-4e75-beeb-bfae960815ae"
		// >
		// </div>
		<Fragment>
			<div className="container eventCard-controls">
				<button className="button button_round eventCard-button">
					<img src={deleteIcon} alt="delete icon" />
				</button>
				<button className="button button_round eventCard-button">
					<img src={closeIcon} alt="close icon" />
				</button>
			</div>
			<div className="container eventCardData">
				<h2>{event.title}</h2>
				<p>
					<span>{dateString}</span>
					<span> ⋅ </span>
					<span>{eventTimeRange}</span>
				</p>
			</div>
		</Fragment>
	);
};

interface DayCellProps {
	date: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
	onModalBodyChange: Function;
}

interface TimeSlotProps {
	dateFormatter: DateFormatter;
	date: Date;
	cellTimeslots: FormData[][];
	index: number;
	onModalBodyChange: Function;
}

interface EventBubbleProps {
	timeslotEvents: FormData[];
	index: number;
	dateFormatter: DateFormatter;
	onModalBodyChange: Function;
}

const EventBubble = ({
	timeslotEvents,
	index,
	dateFormatter,
	onModalBodyChange,
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
		<div
			className="eventBubble"
			data-event-id={event.id}
			style={style}
			onClick={() =>
				onModalBodyChange(
					<EventCard event={event} dateFormatter={dateFormatter} />
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
								onModalBodyChange={onModalBodyChange}
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
	onModalBodyChange: Function;
}

const handleWeekViewClick = (event: any) => {
	const eventTarget = event.nativeEvent.target as HTMLElement;
	const eventTargetDataset = eventTarget.dataset;
	console.log({ eventTarget, eventTargetDataset, natEvent: event.nativeEvent });
	if (eventTargetDataset.timestamp) {
		// showFormModal(new Date(parseInt(eventTargetDataset.timestamp)));
	}
};
const WeekView = ({
	selectedDate,
	dateFormatter,
	onLocalStorageChange,
	events,
	onModalBodyChange,
}: WeekViewProps) => {
	const weekDates = getWeekDates(selectedDate);

	return (
		<div
			className="weekView-main"
			onClick={(e) => {
				handleWeekViewClick(e);
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
						onModalBodyChange={onModalBodyChange}
					/>
				);
			})}
		</div>
	);
};

export default WeekView;
