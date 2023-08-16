import React from "react";
import { LocaleType } from "../../Utils/dateManipulation";
import { createDateFormatter } from "../../Utils/dateFormatter";
import "./MonthYearLabel.css";

interface HeaderProps {
	locale: LocaleType;
	selectedDate: Date;
}
const MonthYearLabel: React.FC<HeaderProps> = ({ locale, selectedDate }) => {
	const dateFormatter = createDateFormatter(locale);

	return (
		<div className="monthYearLabel">
			<span>{dateFormatter.getMonthYearLabel(selectedDate)}</span>
		</div>
	);
};

export default MonthYearLabel;
