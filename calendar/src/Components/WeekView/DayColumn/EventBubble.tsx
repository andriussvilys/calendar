import { Fragment, useContext } from "react";
import { FormData, getEventDuration } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";

import EventCard from "./EventCard";
import Modal from "../../Modal/Modal";
import useModal from "../../Modal/useModal";
import { ModalContext } from "../../Modal/ModalContext";

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

	const eventCard = (
		<EventCard
			event={event}
			dateFormatter={dateFormatter}
			hideModal={() => modalContext.setModalVisibility(false)}
		/>
	);

	const modalContext = useContext(ModalContext);

	return (
		<div
			className="eventBubble"
			data-event-id={event.id}
			style={style}
			onClick={(e) => {
				e.stopPropagation();
				modalContext.setModalChildren(eventCard);
				modalContext.setModalVisibility(true);
			}}
		>
			<span className="eventBubble-title">{event.title}</span>
			<span>{eventTime}</span>
		</div>
	);
};

export default EventBubble;
