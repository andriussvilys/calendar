import {
	roundTimestampToHours,
	getEventTimeslot,
} from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import { EventData } from "../../../Utils/database";
import Timeslot from "./Timeslot";

export interface DayCellProps {
	date: Date;
	dateFormatter: DateFormatter;
	events: EventData[];
}

//DayCell represents 1 hour period in a day
const DayCell = ({ date, dateFormatter, events }: DayCellProps) => {
	const timestamp = date.valueOf();
	//filter events that are on the same hour as this DayCell
	const filteredEvents = events.filter((event) => {
		return roundTimestampToHours(event) === timestamp;
	});
	const timeSlots: EventData[][] = [[], [], [], []];

	filteredEvents.forEach((eventData) => {
		const timeslotIndex = getEventTimeslot(eventData);
		timeSlots[timeslotIndex].push(eventData);
	});
	return (
		<div className="day-border dayCell" data-timestamp={timestamp}>
			{timeSlots.map((timeslot, index) => {
				return (
					<Timeslot
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

export default DayCell;
