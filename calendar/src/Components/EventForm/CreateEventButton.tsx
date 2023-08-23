import EventForm from "./EventForm";
import { FormData, roundTimestampToHours } from "../../Utils/database";
import { roundTimestampToTimeslot } from "../../Utils/dateManipulation";
import { Fragment } from "react";
import Modal from "../Modal/Modal";
import useModal from "../Modal/useModal";

const CreateEventButton = ({}) => {
	const [isModalVisible, setModal] = useModal(false);

	const eventForm = (
		<EventForm
			key={Date.now().valueOf()}
			hideModal={() => setModal(false)}
			timestamp={roundTimestampToTimeslot(new Date().valueOf())}
		/>
	);

	return (
		<Fragment>
			<button
				className="button button-primary create"
				onClick={() => {
					setModal(true);
				}}
			>
				Create Event
			</button>
			<Modal isVisible={isModalVisible} setModalVisibility={setModal}>
				{eventForm}
			</Modal>
		</Fragment>
	);
};

export default CreateEventButton;
