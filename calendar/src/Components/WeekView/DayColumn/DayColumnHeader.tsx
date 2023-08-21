import { DateFormatter } from "../../../Utils/dateFormatter";
import { getToday, isSameDate } from "../../../Utils/dateManipulation";

interface DayColumnHeaderProps {
	date: Date;
	dateFormatter: DateFormatter;
}
const DayColumnHeader = ({ date, dateFormatter }: DayColumnHeaderProps) => {
	return (
		<div className="container header-cell">
			<div className="container day-label">
				<span className="">{dateFormatter.getWeekDateLabel(date)}</span>
				<button
					className={`button dayLabel-button button_round ${
						isSameDate(date, getToday()) ? "button_today" : ""
					}`}
				>
					{dateFormatter.getDate(date)}
				</button>
			</div>
			<div className="day-border eventCell_header"></div>
		</div>
	);
};

export default DayColumnHeader;
