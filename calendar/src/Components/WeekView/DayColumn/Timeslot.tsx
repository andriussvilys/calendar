import { Fragment, useContext } from "react";
import { EventData } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import EventBubbleContainer from "./EventBubbleContainer";
import { ModalContentTypes, ModalContext } from "../../Modal/ModalContext";

export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;

interface TimeSlotProps {
	dateFormatter: DateFormatter;
	date: Date;
	cellTimeslots: EventData[][];
	index: number;
}

const Timeslot = ({
	date,
	dateFormatter,
	cellTimeslots,
	index,
}: TimeSlotProps) => {
	const timeslotTimestamp = date
		.setMinutes(index * TIMESLOT_DURATION)
		.valueOf();

	// const [isVisible, setModal] = useModal(false);
	const modalContext = useContext(ModalContext);

	return (
		<Fragment>
			<div
				className="timeslot"
				style={{ top: `${index * EVENTBUBBLE_OFFSET}%` }}
				onClick={() => {
					modalContext.openModal({
						id: ModalContentTypes.EVENT_FORM,
						data: timeslotTimestamp,
					});
				}}
			>
				<div className="timeslot-innerContainer">
					<EventBubbleContainer
						dayCellEvents={cellTimeslots}
						timeslotEvents={cellTimeslots[index]}
						timeslotIndex={index}
						dateFormatter={dateFormatter}
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default Timeslot;
