import DayColumnHeader from "./DayColumnHeader";
import DayCell, { DayCellProps } from "./DayCell";
import { HOUR_COUNT } from "../../../Utils/dateManipulation";

const DayColumn = ({ date, dateFormatter, events }: DayCellProps) => {
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
					/>
				);
			})}
		</div>
	);
};

export default DayColumn;
