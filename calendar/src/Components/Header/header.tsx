import React from "react";
import {
	incrementDay,
	WEEKDAYS,
	LocaleType,
	getToday,
} from "../../Utils/dateManipulation";
import MonthYearLabel from "../MonthYearLabel/MonthYearLabel";
import ArrowControls from "../ArrowControls/ArrowControls";
import LocaleSelect from "./LocaleSelect";
import "./header.css";
import { DateFormatter } from "../../Utils/dateFormatter";

interface HeaderProps {
	dateFormatter: DateFormatter;
	selectedDate: Date;
	onLocaleChange: Function;
	onSelectedDateChange: Function;
}

export const Header = ({
	dateFormatter,
	selectedDate,
	onLocaleChange,
	onSelectedDateChange,
}: HeaderProps) => {
	const handleNextPrevClick = (direction: number): void => {
		const newDate = incrementDay(selectedDate, WEEKDAYS * direction);
		onSelectedDateChange(newDate);
	};

	return (
		<header className="container header">
			<div className="container">
				<div className="logo">
					<h1>Calendar</h1>
				</div>
				<div className="container controls">
					<button
						id="button_today"
						className="button button_secondary today"
						onClick={() => onSelectedDateChange(getToday())}
					>
						Today
					</button>
					<ArrowControls
						onBackArrowClick={() => handleNextPrevClick(-1)}
						onForwardArrowClick={() => handleNextPrevClick(1)}
					/>
				</div>
				<MonthYearLabel
					dateFormatter={dateFormatter}
					selectedDate={selectedDate}
				/>
			</div>

			<LocaleSelect onLocaleChange={onLocaleChange} />
		</header>
	);
};
