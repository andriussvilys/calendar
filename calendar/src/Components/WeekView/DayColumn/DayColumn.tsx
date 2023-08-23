import DayColumnHeader from "./DayColumnHeader";
import DayCell, { DayCellProps } from "./DayCell";
import { HOUR_COUNT } from "../../../Utils/dateManipulation";
import { useEffect } from "react";

const DayColumn = ({
	date,
	dateFormatter,
	events,
	removeFromLocalStorage,
	saveToLocalStorage,
}: DayCellProps) => {
	return (
		<div className="weekView-column">
			<DayColumnHeader date={date} dateFormatter={dateFormatter} />
			{[...Array(HOUR_COUNT).keys()].map((hour, index) => {
				const dayCellDate = new Date(date);
				dayCellDate.setHours(hour);
				const timestamp = dayCellDate.valueOf();

				return (
					<DayCell
						key={timestamp}
						date={dayCellDate}
						dateFormatter={dateFormatter}
						events={events}
						removeFromLocalStorage={removeFromLocalStorage}
						saveToLocalStorage={saveToLocalStorage}
					/>
				);
			})}
		</div>
	);
};

export default DayColumn;
