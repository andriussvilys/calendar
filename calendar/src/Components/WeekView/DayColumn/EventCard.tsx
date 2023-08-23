import deleteIcon from "../../../images/delete_FILL0_wght400_GRAD0_opsz48.svg";
import closeIcon from "../../../images/close_FILL0_wght400_GRAD0_opsz48.svg";
import { DateFormatter } from "../../../Utils/dateFormatter";
import { FormData, deleteEvent } from "../../../Utils/database";

interface EventCardProps {
	event: FormData;
	dateFormatter: DateFormatter;
	hideModal: () => void;
	removeFromLocalStorage: (eventId: string) => void;
}
const EventCard = ({
	event,
	dateFormatter,
	hideModal,
	removeFromLocalStorage,
}: EventCardProps) => {
	const dateString = dateFormatter.getEventDate(new Date(event.startTime));

	const eventTimeRange = dateFormatter.getEventHourRange(
		event.startTime,
		event.endTime
	);
	return (
		<div className="eventCard">
			<div className="container eventCard-controls">
				<button
					className="button button_round eventCard-button"
					onClick={() => {
						deleteEvent(event.id);
						hideModal();
					}}
				>
					<img src={deleteIcon} alt="delete icon" />
				</button>
				<button
					className="button button_round eventCard-button"
					onClick={() => hideModal()}
				>
					<img src={closeIcon} alt="close icon" />
				</button>
			</div>
			<div className="container eventCardData">
				<h2 className="eventCardBlock">{event.title}</h2>
				<p className="eventCardBlock">
					<span>{dateString}</span>
					<span> ⋅ </span>
					<span>{eventTimeRange}</span>
				</p>
				<p className="eventCardBlock">{event.description}</p>
			</div>
		</div>
	);
};

export default EventCard;
