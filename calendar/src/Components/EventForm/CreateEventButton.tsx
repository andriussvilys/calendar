import { TIMESLOT_DURATION } from "../WeekView/DayColumn/Timeslot";
import EventForm from "./EventForm";

interface CreateEventButtonProps {
	openModal: Function;
	hideModal: Function;
	saveToLocalStorage: Function;
}

export const roundTimestampToTimeslotMinutes = (timestamp: number) => {
	const minutes = new Date(timestamp).getMinutes();
	const timeslot = Math.floor(minutes / TIMESLOT_DURATION);
	return new Date(timestamp).setMinutes(timeslot * TIMESLOT_DURATION);
};

const CreateEventButton = ({
	hideModal,
	openModal,
	saveToLocalStorage,
}: CreateEventButtonProps) => {
	const handleOnClick = () => {
		const eventForm = (
			<EventForm
				key={Date.now().valueOf()}
				hideModal={hideModal}
				saveToLocalStorage={saveToLocalStorage}
				timestamp={roundTimestampToTimeslotMinutes(new Date().valueOf())}
			/>
		);
		openModal(eventForm);
	};

	return (
		<button
			className="button button-primary create"
			onClick={() => {
				handleOnClick();
			}}
		>
			Create Event
		</button>
	);
};

export default CreateEventButton;
