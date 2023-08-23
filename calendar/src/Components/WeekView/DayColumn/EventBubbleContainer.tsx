import { getEventDuration } from "../../../Utils/database";
import { FormData } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import EventBubble from "./EventBubble";

const OFFSET_INCREMENT = 20;

interface EventBubbleContainerProps {
	dayCellEvents: FormData[][];
	timeslotEvents: FormData[];
	timeslotIndex: number;
	dateFormatter: DateFormatter;
}

const EventBubbleContainer = ({
	dayCellEvents,
	timeslotEvents,
	timeslotIndex,
	dateFormatter,
}: EventBubbleContainerProps) => {
	const sorted = timeslotEvents.sort(
		(a, b) => getEventDuration(b) - getEventDuration(a)
	);
	const prevTimeslotSize = dayCellEvents
		.slice(0, timeslotIndex)
		.reduce((acc, prevArray) => {
			return Math.max(acc, prevArray.length);
		}, 0);
	const offset = Math.min(
		prevTimeslotSize * OFFSET_INCREMENT,
		OFFSET_INCREMENT
	);
	const width = 100 - offset;

	return (
		<div
			className="eventBubbleContainer"
			style={{
				left: `${offset}%`,
				width: `${width}%`,
			}}
		>
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
	);
};

export default EventBubbleContainer;
