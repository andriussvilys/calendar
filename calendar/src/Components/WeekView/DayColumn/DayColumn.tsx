import DayColumnHeader from "./DayColumnHeader";
import DayCell, { DayCellProps } from "./DayCell";
import { HOUR_COUNT } from "../../../Utils/dateManipulation";

const DayColumn = ({
	date,
	dateFormatter,
	events,
	onModalBodyChange,
	hideModal,
	removeFromLocalStorage,
}: DayCellProps) => {
	return (
		<div className="weekView-column">
			<DayColumnHeader date={date} dateFormatter={dateFormatter} />
			{[...Array(HOUR_COUNT).keys()].map((hour) => {
				const dayCellDate = new Date(date);
				dayCellDate.setHours(hour);
				const timestamp = dayCellDate.valueOf();
				return (
					<DayCell
						key={timestamp}
						date={dayCellDate}
						dateFormatter={dateFormatter}
						events={events}
						onModalBodyChange={onModalBodyChange}
						hideModal={hideModal}
						removeFromLocalStorage={removeFromLocalStorage}
					/>
				);
			})}
		</div>
	);
};

export default DayColumn;
