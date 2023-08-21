import { DateFormatter } from "../../Utils/dateFormatter";
import { WEEKDAYS, incrementMonth } from "../../Utils/dateManipulation";
import ArrowControls from "../ArrowControls/ArrowControls";
import MonthYearLabel from "../MonthYearLabel/MonthYearLabel";
import DayCell from "./DayCell";
import "./months.css";

const CALENDAR_ROWS = 6;

interface WeekDayLabelsProps {
  date: Date;
  dateFormatter: DateFormatter;
}

const WeekDayLabels = ({ date, dateFormatter }: WeekDayLabelsProps) => {
  return (
    <div className="container centered monthView-weekDayNames">
      {dateFormatter.getWeekDayLabels(date).map((label) => {
        return <span key={label}>{label.slice(0, 1)}</span>;
      })}
    </div>
  );
};

const onArrowControlClick = (
  selectedDate: Date,
  onDateChange: Function,
  direction: number,
) => {
  const nextDate = incrementMonth(selectedDate, direction);
  onDateChange(nextDate);
};

interface MonthViewProps {
  dateFormatter: DateFormatter;
  selectedDate: Date;
  onDateChange: Function;
}

const MonthView = ({
  dateFormatter,
  selectedDate,
  onDateChange,
}: MonthViewProps) => {
  return (
    <div className="monthView">
      <div className="container monthView-header">
        <MonthYearLabel
          dateFormatter={dateFormatter}
          selectedDate={selectedDate}
        />
        <ArrowControls
          onForwardArrowClick={() =>
            onArrowControlClick(selectedDate, onDateChange, +1)
          }
          onBackArrowClick={() =>
            onArrowControlClick(selectedDate, onDateChange, -1)
          }
        />
      </div>
      <div className="monthView-main">
        <WeekDayLabels date={selectedDate} dateFormatter={dateFormatter} />
        <MonthViewDates
          dateFormatter={dateFormatter}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>
    </div>
  );
};

const MonthViewDates = ({
  dateFormatter,
  selectedDate,
  onDateChange,
}: MonthViewProps) => {
  const monthView = getMonthViewDays(selectedDate);
  return (
    <div className="monthView-days">
      {monthView.map((day) => {
        return (
          <DayCell
            key={day.valueOf()}
            dateFormatter={dateFormatter}
            date={day}
            onDateChange={onDateChange}
            selectedDate={selectedDate}
          />
        );
      })}
    </div>
  );
};

const getMonthViewDays = (newDate: Date): Date[] => {
  const year = newDate.getFullYear();
  const month = newDate.getMonth();

  const result: Date[] = [];

  const firstMonthDay = new Date(year, month).getDay();

  //get the day before the first day of current month, ie previous month length
  const prevMonthLength = new Date(year, month, 0).getDate();

  //days before current month
  for (
    let index = prevMonthLength - 7 + 1 + ((7 - firstMonthDay + 1) % 7);
    index < prevMonthLength + 1;
    index++
  ) {
    result.push(new Date(year, month - 1, index));
  }

  //current Month
  const monthLength = new Date(year, month + 1, 0).getDate();

  for (let index = 1; index < monthLength + 1; index++) {
    result.push(new Date(year, month, index));
  }

  const remainder = WEEKDAYS * CALENDAR_ROWS - result.length;

  //days after current month
  for (let index = 1; index < remainder + 1; index++) {
    result.push(new Date(year, month + 1, index));
  }

  return result;
};

export default MonthView;
