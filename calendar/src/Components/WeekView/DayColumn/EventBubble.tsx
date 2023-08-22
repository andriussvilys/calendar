import { FormData, getEventDuration } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";

import EventCard from "./EventCard";

interface EventBubbleProps {
	timeslotEvents: FormData[];
	index: number;
	dateFormatter: DateFormatter;
	openModal: (children: JSX.Element) => void;
	hideModal: () => void;
	removeFromLocalStorage: (eventId: string) => void;
}

const EventBubble = ({
	timeslotEvents,
	index,
	dateFormatter,
	openModal,
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
				openModal(
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

export default EventBubble;
