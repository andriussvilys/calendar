import { getWeekDates } from "../../Utils/dateManipulation";
import { FormData } from "../../Utils/database";
import { DateFormatter } from "../../Utils/dateFormatter";

import "./weekView.css";

import EventForm, { EventFormProps } from "../EventForm/EventForm";
import HourColumn from "./HourColumn/HourColumn";
import DayColumn from "./DayColumn/DayColumn";

const handleWeekViewClick = (
	event: any,
	openModal: Function,
	hideModal: Function,
	saveToLocalStorage: Function
) => {
	const eventTarget = event.nativeEvent.target as HTMLElement;
	console.log(eventTarget);
	const eventTargetDataset = eventTarget.dataset;
	if (eventTargetDataset.timestamp) {
		const timestamp: number = Number.parseInt(
			event.nativeEvent.target.dataset.timestamp
		);
		const eventForm = (
			<EventForm
				key={Date.now().valueOf()}
				hideModal={hideModal}
				saveToLocalStorage={saveToLocalStorage}
				timestamp={timestamp}
			/>
		);
		openModal(eventForm);
	}
};

interface WeekViewProps extends EventFormProps {
	selectedDate: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
	openModal: Function;
	removeFromLocalStorage: Function;
}
const WeekView = ({
	selectedDate,
	dateFormatter,
	events,
	openModal,
	hideModal,
	saveToLocalStorage,
	removeFromLocalStorage,
}: WeekViewProps) => {
	const weekDates = getWeekDates(selectedDate);

	return (
		<div
			className="weekView-main"
			onClick={(e) => {
				handleWeekViewClick(e, openModal, hideModal, saveToLocalStorage);
			}}
		>
			<HourColumn dateFormatter={dateFormatter} />
			{weekDates.map((date) => {
				return (
					<DayColumn
						key={date.valueOf()}
						date={date}
						dateFormatter={dateFormatter}
						events={events}
						onModalBodyChange={openModal}
						hideModal={hideModal}
						removeFromLocalStorage={removeFromLocalStorage}
					/>
				);
			})}
		</div>
	);
};

export default WeekView;
