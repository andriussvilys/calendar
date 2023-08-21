import { DateFormatter } from "../../Utils/dateFormatter";
import "./MonthYearLabel.css";

interface MonthYearLabelProps {
  dateFormatter: DateFormatter;
  selectedDate: Date;
}
const MonthYearLabel = ({
  dateFormatter,
  selectedDate,
}: MonthYearLabelProps) => {
  return (
    <div className="monthYearLabel">
      <span>{dateFormatter.getMonthYearLabel(selectedDate)}</span>
    </div>
  );
};

export default MonthYearLabel;
