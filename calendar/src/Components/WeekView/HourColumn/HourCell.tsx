import { DateFormatter } from "../../../Utils/dateFormatter";

interface HourCellProps {
	timestamp: number;
	dateFormatter: DateFormatter;
}
const HourCell = ({ timestamp, dateFormatter }: HourCellProps) => {
	return (
		<div className="hour">
			<div className="hour-labelContainer">
				<div className="hour-labelContent">
					<span>{dateFormatter.getHour(timestamp)}</span>
					<span> </span>
				</div>
			</div>
			<div className="hour-separator"></div>
		</div>
	);
};

export default HourCell;
