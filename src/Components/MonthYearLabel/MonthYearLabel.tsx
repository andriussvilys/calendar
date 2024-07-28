import { DateFormatter } from "../../Utils/dateFormatter";
import "./MonthYearLabel.css";

interface MonthYearLabelProps {
	dateFormatter: DateFormatter;
	selectedDate: Date;
	classList: string | null;
}
const MonthYearLabel = ({
	dateFormatter,
	selectedDate,
	classList,
}: MonthYearLabelProps) => {
	return (
		<div className={`monthYearLabel ${classList}`}>
			<span>{dateFormatter.getMonthYearLabel(selectedDate)}</span>
		</div>
	);
};

export default MonthYearLabel;
