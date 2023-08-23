import { Fragment } from "react";
import { FormData, getEventDuration } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";

import EventCard from "./EventCard";
import Modal from "../../Modal/Modal";
import useModal from "../../Modal/useModal";

interface EventBubbleProps {
	timeslotEvents: FormData[];
	index: number;
	dateFormatter: DateFormatter;
	removeFromLocalStorage: (eventId: string) => void;
}

const EventBubble = ({
	timeslotEvents,
	index,
	dateFormatter,
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

	const [isModalVisible, setModal] = useModal(false);

	return (
		<Fragment>
			<div
				className="eventBubble"
				data-event-id={event.id}
				style={style}
				onClick={(e) => {
					e.stopPropagation();
					setModal(true);
				}}
			>
				<span className="eventBubble-title">{event.title}</span>
				<span>{eventTime}</span>
			</div>
			<Modal isVisible={isModalVisible} setModalVisibility={setModal}>
				<EventCard
					event={event}
					dateFormatter={dateFormatter}
					hideModal={() => setModal(false)}
					removeFromLocalStorage={removeFromLocalStorage}
				/>
			</Modal>
		</Fragment>
	);
};

export default EventBubble;
