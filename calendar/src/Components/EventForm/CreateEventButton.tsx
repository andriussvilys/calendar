import EventForm from "./EventForm";
import { roundTimestampToTimeslot } from "../../Utils/dateManipulation";
import { Fragment, useContext } from "react";
import { ModalContext } from "../Modal/ModalContext";

const CreateEventButton = ({}) => {
	const eventForm = (
		<EventForm
			key={Date.now().valueOf()}
			hideModal={() => modalContext.setModalVisibility(false)}
			timestamp={roundTimestampToTimeslot(new Date().valueOf())}
		/>
	);

	const modalContext = useContext(ModalContext);
	const setModalProps = () => {
		modalContext.setModalChildren(eventForm);
		modalContext.setModalVisibility(true);
	};

	return (
		<Fragment>
			<button
				className="button button-primary create"
				onClick={() => {
					setModalProps();
				}}
			>
				Create Event
			</button>
		</Fragment>
	);
};

export default CreateEventButton;
