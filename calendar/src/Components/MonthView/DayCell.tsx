import { createDateFormatter } from "../../Utils/dateFormatter";
import { LocaleType, getToday, isSameDate } from "../../Utils/dateManipulation";

interface DayCellProps {
	locale: LocaleType;
	date: Date;
	onDateChange: Function;
}

const generateDayCell = (
	locale: LocaleType,
	date: Date,
	onDateChange: Function
) => {
	// const container = document.createElement("div");
	// container.className = `container monthView-cell`;

	// const button = document.createElement("button");
	// button.className = `button button_round monthView-button ${
	// 	isSameDate(date, getToday()) ? "button_today" : ""
	// }`;

	// button.innerText = createDateFormatter(locale).getDate(date);

	// button.dataset.timestamp = date.valueOf().toString();

	// button.addEventListener("click", (e) =>
	// 	onMonthButtonClick(e.target as HTMLElement, onDateChange)
	// );

	// container.appendChild(button);

	return (
		<div className="container monthView-cell">
			<button
				className={`button button_round monthView-button ${
					isSameDate(date, getToday()) ? "button_today" : ""
				}`}
				onClick={(e) => {
					onMonthButtonClick(e.target as HTMLElement, onDateChange);
				}}
			>
				{createDateFormatter(locale).getDate(date)}
			</button>
		</div>
	);
};

const onMonthButtonClick = (
	eventTarget: HTMLElement,
	onDateChange: Function
) => {
	const timestamp = eventTarget?.dataset?.timestamp;
	if (timestamp) {
		const newDate = new Date(Number(timestamp));
		onDateChange(newDate);
	}
};
