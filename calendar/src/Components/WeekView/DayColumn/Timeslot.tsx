import { Fragment } from "react";
import { FormData } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import EventForm from "../../EventForm/EventForm";
import useModal from "../../Modal/useModal";

import Modal from "../../Modal/Modal";
import EventBubbleContainer from "./EventBubbleContainer";

export const TIMESLOT_DURATION = 15;
const EVENTBUBBLE_OFFSET = 25;

interface TimeSlotProps {
	dateFormatter: DateFormatter;
	date: Date;
	cellTimeslots: FormData[][];
	index: number;
	removeFromLocalStorage: (eventId: string) => void;
	saveToLocalStorage: (event: FormData) => void;
}

const Timeslot = ({
	date,
	dateFormatter,
	cellTimeslots,
	index,
	removeFromLocalStorage,
	saveToLocalStorage,
}: TimeSlotProps) => {
	const timeslotTimestamp = date
		.setMinutes(index * TIMESLOT_DURATION)
		.valueOf();

	const [isVisible, setModal] = useModal(false);

	return (
		<Fragment>
			<div
				className="timeslot"
				style={{ top: `${index * EVENTBUBBLE_OFFSET}%` }}
				onClick={() => {
					setModal(true);
				}}
			>
				<div className="timeslot-innerContainer">
					<EventBubbleContainer
						dayCellEvents={cellTimeslots}
						timeslotEvents={cellTimeslots[index]}
						timeslotIndex={index}
						dateFormatter={dateFormatter}
						removeFromLocalStorage={removeFromLocalStorage}
					/>
				</div>
			</div>
			<Modal isVisible={isVisible} setModalVisibility={setModal}>
				<EventForm
					key={Date.now().valueOf()}
					hideModal={() => setModal(false)}
					saveToLocalStorage={saveToLocalStorage}
					timestamp={timeslotTimestamp}
				/>
			</Modal>
		</Fragment>
	);
};

export default Timeslot;
