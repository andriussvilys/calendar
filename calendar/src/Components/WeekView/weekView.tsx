import { getWeekDates, isSameDate } from "../../Utils/dateManipulation";
import { FormData } from "../../Utils/database";
import { DateFormatter } from "../../Utils/dateFormatter";

import { useEffect, useRef, useState } from "react";
import WeekViewContent from "./WeekViewContent";
import "./weekView.css";
import { EventFormProps } from "../EventForm/EventForm";

const getDirection = (prevDate: number, currentDate: number): number => {
	const temp = currentDate - prevDate;
	if (temp === 0) return 0;
	return Math.abs(temp) / temp;
};

const getAnimationName = (direction: number): string => {
	switch (direction) {
		case 1:
			return "slideIn_ltr";
		case -1:
			return "slideIn_rtl";
		default:
			return "";
	}
};

interface WeekViewProps extends EventFormProps {
	selectedDate: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
	openModal: (children: JSX.Element) => void;
	removeFromLocalStorage: (eventId: string) => void;
}
const WeekView = ({
	selectedDate,
	dateFormatter,
	events,
	saveToLocalStorage,
	removeFromLocalStorage,
}: WeekViewProps) => {
	const [nextWeekDates, setNextWeekDates] = useState<Date[]>([]);
	const [currentWeekDates, setCurrentDates] = useState<Date[]>(
		getWeekDates(selectedDate)
	);

	const currentDate = useRef<number>(Date.now().valueOf());
	const prevDate = useRef<number>(Date.now().valueOf());
	const container = useRef<HTMLDivElement>(null);
	const direction = prevDate.current
		? getDirection(prevDate.current, selectedDate.valueOf())
		: 0;

	const animationName = getAnimationName(direction);

	useEffect(() => {
		prevDate.current = currentDate.current;
		currentDate.current = selectedDate.valueOf();
		if (
			!isSameDate(new Date(prevDate.current), new Date(currentDate.current))
		) {
			const nextDates = getWeekDates(selectedDate);
			if (nextDates[0] === currentWeekDates[0]) {
				return;
			}
			setNextWeekDates(nextDates);
			setTimeout(() => {
				setCurrentDates([...nextDates]);
				setNextWeekDates([]);
			}, 200);
		}
	}, [selectedDate]);

	useEffect(() => {
		container.current?.scrollTo({ top: 0, behavior: "smooth" });
	}, [selectedDate]);

	return (
		<div ref={container} className="weekView-main-container">
			{nextWeekDates.length ? (
				<WeekViewContent
					animationName={animationName}
					dates={nextWeekDates}
					dateFormatter={dateFormatter}
					events={events}
					removeFromLocalStorage={removeFromLocalStorage}
					saveToLocalStorage={saveToLocalStorage}
				/>
			) : null}

			<WeekViewContent
				animationName={""}
				dates={currentWeekDates}
				dateFormatter={dateFormatter}
				events={events}
				removeFromLocalStorage={removeFromLocalStorage}
				saveToLocalStorage={saveToLocalStorage}
			/>
		</div>
	);
};

export default WeekView;
