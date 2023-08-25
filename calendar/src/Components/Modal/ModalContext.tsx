import {
	Fragment,
	PropsWithChildren,
	ReactNode,
	createContext,
	useState,
} from "react";
import Modal from "./Modal";
import { EventData } from "../../Utils/database";
import EventForm from "../EventForm/EventForm";
import { roundTimestampToTimeslot } from "../../Utils/dateManipulation";
import EventCard from "../WeekView/DayColumn/EventCard";
import { DateFormatter } from "../../Utils/dateFormatter";

export enum ModalContentTypes {
	EVENT_FORM = "EVENT_FORM",
	EVENT_CARD = "EVENT_CARD",
}

type OpenEventFormType = {
	id: ModalContentTypes.EVENT_FORM;
	data: number;
};

type OpenEventCardType = {
	id: ModalContentTypes.EVENT_CARD;
	data: { event: EventData; dateFormatter: DateFormatter };
};

type OpenModalActionType = OpenEventCardType | OpenEventFormType;

interface ModalContextProps {
	openModal: ({ id, data }: OpenModalActionType) => void;
	setModalVisibility: (value: boolean) => void;
}

const modalContextProps: ModalContextProps = {
	setModalVisibility: () => {},
	openModal: () => {},
};
export const ModalContext = createContext(modalContextProps);

export const ModalContextProvider = ({ children }: PropsWithChildren) => {
	const [isModalVisible, setIsVisible] = useState<boolean>(false);
	const [modalChildren, setModalChildren] = useState<ReactNode>(null);

	const openModal = (action: OpenModalActionType) => {
		setIsVisible(true);
		setModalChildren(renderContent(action));
	};

	const setModalVisibility = (value: boolean): void => {
		setIsVisible(value);
	};

	const renderContent = (action: OpenModalActionType) => {
		switch (action.id) {
			case ModalContentTypes.EVENT_FORM: {
				return (
					<EventForm
						hideModal={() => setModalVisibility(false)}
						timestamp={roundTimestampToTimeslot(action.data)}
					/>
				);
				break;
			}
			case ModalContentTypes.EVENT_CARD: {
				return (
					<EventCard
						event={action.data.event}
						dateFormatter={action.data.dateFormatter}
						hideModal={() => setModalVisibility(false)}
					/>
				);
			}
		}
	};

	return (
		<Fragment>
			<ModalContext.Provider
				value={{
					setModalVisibility,
					openModal,
				}}
			>
				{children}
			</ModalContext.Provider>
			<Modal isVisible={isModalVisible} setModalVisibility={setModalVisibility}>
				{modalChildren}
			</Modal>
		</Fragment>
	);
};
