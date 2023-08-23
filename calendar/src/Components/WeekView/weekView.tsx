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

interface WeekViewProps {
	selectedDate: Date;
	dateFormatter: DateFormatter;
	events: FormData[];
}
const WeekView = ({ selectedDate, dateFormatter, events }: WeekViewProps) => {
	const [nextWeekDates, setNextWeekDates] = useState<Date[]>([]);
	const [currentWeekDates, setCurrentDates] = useState<Date[]>(
		getWeekDates(selectedDate)
	);

	const prevTimeout = useRef<NodeJS.Timeout | null>(null);

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
			if (prevTimeout.current) {
				clearTimeout(prevTimeout.current);
			}

			const nextDates = getWeekDates(selectedDate);
			if (nextDates[0] === currentWeekDates[0]) {
				return;
			}
			setNextWeekDates(nextDates);
			prevTimeout.current = setTimeout(() => {
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
				/>
			) : null}

			<WeekViewContent
				animationName={""}
				dates={currentWeekDates}
				dateFormatter={dateFormatter}
				events={events}
			/>
		</div>
	);
};

export default WeekView;
