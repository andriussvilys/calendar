import {
	roundTimestampToHours,
	getEventTimeslot,
} from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import { FormData } from "../../../Utils/database";
import Timeslot from "./Timeslot";

export interface DayCellProps {
	date: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
	removeFromLocalStorage: (eventId: string) => void;
	saveToLocalStorage: (event: FormData) => void;
}

//DayCell represents 1 hour period in a day
const DayCell = ({
	date,
	dateFormatter,
	events,
	removeFromLocalStorage,
	saveToLocalStorage,
}: DayCellProps) => {
	const timestamp = date.valueOf();
	//filter events that are on the same hour as this DayCell
	const filteredEvents = events.filter((event) => {
		return roundTimestampToHours(event) === timestamp;
	});
	const timeSlots: FormData[][] = [[], [], [], []];

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
						removeFromLocalStorage={removeFromLocalStorage}
						saveToLocalStorage={saveToLocalStorage}
					/>
				);
			})}
		</div>
	);
};

export default DayCell;
