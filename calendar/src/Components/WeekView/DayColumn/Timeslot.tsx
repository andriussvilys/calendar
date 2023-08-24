import { Fragment, useContext } from "react";
import { FormData } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import EventForm from "../../EventForm/EventForm";
import useModal from "../../Modal/useModal";

import Modal from "../../Modal/Modal";
import EventBubbleContainer from "./EventBubbleContainer";
import { ModalContext } from "../../Modal/ModalContext";

export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;

interface TimeSlotProps {
	dateFormatter: DateFormatter;
	date: Date;
	cellTimeslots: FormData[][];
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
	const eventForm = (
		<EventForm
			key={Date.now().valueOf()}
			hideModal={() => modalContext.setModalVisibility(false)}
			timestamp={timeslotTimestamp}
		/>
	);

	return (
		<Fragment>
			<div
				className="timeslot"
				style={{ top: `${index * EVENTBUBBLE_OFFSET}%` }}
				onClick={() => {
					modalContext.setModalChildren(eventForm);
					modalContext.setModalVisibility(true);
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
