import { FormData, getEventDuration } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";

import EventBubble from "./EventBubble";

export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;

interface TimeSlotProps {
	dateFormatter: DateFormatter;
	date: Date;
	cellTimeslots: FormData[][];
	index: number;
	onModalBodyChange: Function;
	hideModal: Function;
	removeFromLocalStorage: Function;
}

const Timeslot = ({
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

export default Timeslot;
