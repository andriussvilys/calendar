import { DateFormatter } from "../../../Utils/dateFormatter";
import { HOUR_COUNT } from "../../../Utils/dateManipulation";
import HourCell from "./HourCell";

const HourColumn = ({ dateFormatter }: { dateFormatter: DateFormatter }) => {
	return (
		<div className="weekView-column hours">
			<div className="hour header-cell">
				<div className="hour-separator"></div>
			</div>
			{[...Array(HOUR_COUNT - 1).keys()].map((hour) => {
				return (
					<HourCell
						key={new Date(0, 0, 0, hour + 1).valueOf()}
						timestamp={new Date(0, 0, 0, hour + 1).valueOf()}
						dateFormatter={dateFormatter}
					/>
				);
			})}
		</div>
	);
};

export default HourColumn;
