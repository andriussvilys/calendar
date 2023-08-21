import {
	getEventCellTimestamp,
	getEventTimeslot,
} from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import { FormData } from "../../../Utils/database";
import Timeslot from "./Timeslot";

export interface DayCellProps {
	date: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
	onModalBodyChange: Function;
	hideModal: Function;
	removeFromLocalStorage: Function;
}

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
					<Timeslot
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

export default DayCell;
