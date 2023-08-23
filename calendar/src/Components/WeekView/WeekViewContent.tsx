import { DateFormatter } from "../../Utils/dateFormatter";
import DayColumn from "./DayColumn/DayColumn";
import HourColumn from "./HourColumn/HourColumn";
import { FormData } from "../../Utils/database";

interface WeekViewContentProps {
	animationName: string;
	dates: Date[];
	dateFormatter: DateFormatter;
	events: FormData[];
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
						key={date.valueOf()}
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
