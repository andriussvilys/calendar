import EventForm from "./EventForm";
import { FormData } from "../../Utils/database";
import { convertTimestampToTimeslotIndex } from "../../Utils/dateManipulation";
import { Fragment, useState } from "react";
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
			timestamp={convertTimestampToTimeslotIndex(new Date().valueOf())}
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
