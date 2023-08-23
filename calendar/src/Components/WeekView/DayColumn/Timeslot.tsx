import { Fragment } from "react";
import { FormData, getEventDuration } from "../../../Utils/database";
import { DateFormatter } from "../../../Utils/dateFormatter";
import EventForm from "../../EventForm/EventForm";
import useModal from "../../Modal/useModal";

import EventBubble from "./EventBubble";
import Modal from "../../Modal/Modal";

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

	const timeslot: FormData[] = cellTimeslots[index];
	const sorted = timeslot.sort(
		(a, b) => getEventDuration(b) - getEventDuration(a)
	);
	const prevTimeslotSize = cellTimeslots
		.slice(0, index)
		.reduce((acc, prevArray) => {
			return Math.max(acc, prevArray.length);
		}, 0);

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
					<div
						className="eventBubbleContainer"
						style={{
							left: `${prevTimeslotSize * 20}%`,
							width:
								timeslot.length > 0 ? `${100 - prevTimeslotSize * 20}%` : 0,
						}}
					>
						{sorted.map((event, index) => {
							return (
								<EventBubble
									key={event.id}
									timeslotEvents={sorted}
									index={index}
									dateFormatter={dateFormatter}
									removeFromLocalStorage={removeFromLocalStorage}
								/>
							);
						})}
					</div>
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
