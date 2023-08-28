import { useContext } from "react";
import { ModalContentTypes, ModalContext } from "../Modal/ModalContext";

const CreateEventButton = ({}) => {
	const modalContext = useContext(ModalContext);
	const setModalProps = () => {
		modalContext.openModal({
			id: ModalContentTypes.EVENT_FORM,
			data: Date.now().valueOf(),
		});
	};

	return (
		<button
			className="button button-primary create"
			onClick={() => {
				setModalProps();
			}}
		>
			Create Event
		</button>
	);
};

export default CreateEventButton;
