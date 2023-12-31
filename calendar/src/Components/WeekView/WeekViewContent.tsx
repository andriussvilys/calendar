import { DateFormatter } from "../../Utils/dateFormatter";
import DayColumn from "./DayColumn/DayColumn";
import HourColumn from "./HourColumn/HourColumn";
import { EventData } from "../../Utils/database";

interface WeekViewContentProps {
	animationName: string;
	dates: Date[];
	dateFormatter: DateFormatter;
	events: EventData[];
}

const WeekViewContent = ({
	animationName,
	dates,
	dateFormatter,
	events,
}: WeekViewContentProps) => {
	return (
		<div
			key={"next"}
			className={`weekView-main ${
				animationName ? `${animationName} slide` : ""
			}`}
		>
			<HourColumn dateFormatter={dateFormatter} />

			{dates.map((date) => {
				return (
					<DayColumn
						key={`${date.valueOf()}${new Date().valueOf()}`}
						date={date}
						dateFormatter={dateFormatter}
						events={events}
					/>
				);
			})}
		</div>
	);
};

export default WeekViewContent;
