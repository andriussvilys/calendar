import EventForm from "./EventForm";
import { FormData, roundTimestampToHours } from "../../Utils/database";
import { roundTimestampToTimeslot } from "../../Utils/dateManipulation";
import { Fragment } from "react";
import Modal from "../Modal/Modal";
import useModal from "../Modal/useModal";

interface CreateEventButtonProps {
	saveToLocalStorage: (event: FormData) => void;
}

const CreateEventButton = ({ saveToLocalStorage }: CreateEventButtonProps) => {
	const [isModalVisible, setModal] = useModal(false);

	const eventForm = (
		<EventForm
			key={Date.now().valueOf()}
			hideModal={() => setModal(false)}
			saveToLocalStorage={saveToLocalStorage}
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
