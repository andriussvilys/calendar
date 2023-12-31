import { DateFormatter } from "../../Utils/dateFormatter";
import { getToday, isSameDate } from "../../Utils/dateManipulation";

interface DayCellProps {
	dateFormatter: DateFormatter;
	date: Date;
	onDateChange: (newDate: Date) => void;
	selectedDate: Date;
}

const DayCell = ({
	dateFormatter,
	date,
	onDateChange,
	selectedDate,
}: DayCellProps) => {
	return (
		<div className="container monthView-cell">
			<button
				className={`button button_round monthView-button ${
					isSameDate(date, getToday()) ? "button_today" : ""
				} ${isSameDate(date, selectedDate) ? "selected_secondary" : ""}`}
				data-timestamp={date.valueOf()}
				onClick={(e) => {
					onMonthButtonClick(e.target as HTMLElement, onDateChange);
				}}
			>
				{dateFormatter.getDate(date)}
			</button>
		</div>
	);
};

const onMonthButtonClick = (
	eventTarget: HTMLElement,
	onDateChange: (newDate: Date) => void
) => {
	const timestamp = eventTarget?.dataset?.timestamp;
	if (timestamp) {
		const newDate = new Date(Number(timestamp));
		onDateChange(newDate);
	}
};

export default DayCell;
