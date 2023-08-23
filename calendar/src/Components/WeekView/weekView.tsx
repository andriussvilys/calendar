import { getWeekDates, isSameDate } from "../../Utils/dateManipulation";
import { FormData } from "../../Utils/database";
import { DateFormatter } from "../../Utils/dateFormatter";

import "./weekView.css";

import EventForm, { EventFormProps } from "../EventForm/EventForm";
import HourColumn from "./HourColumn/HourColumn";
import DayColumn from "./DayColumn/DayColumn";
import { useEffect, useRef, useState } from "react";

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

const handleWeekViewClick = (
	event: any,
	openModal: (children: JSX.Element) => void,
	hideModal: () => void,
	saveToLocalStorage: (event: FormData) => void
) => {
	const eventTarget = event.nativeEvent.target as HTMLElement;
	console.log(eventTarget);
	const eventTargetDataset = eventTarget.dataset;
	if (eventTargetDataset.timestamp) {
		const timestamp: number = Number.parseInt(
			event.nativeEvent.target.dataset.timestamp
		);
		const eventForm = (
			<EventForm
				key={Date.now().valueOf()}
				hideModal={hideModal}
				saveToLocalStorage={saveToLocalStorage}
				timestamp={timestamp}
			/>
		);
		openModal(eventForm);
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
	openModal,
	hideModal,
	saveToLocalStorage,
	removeFromLocalStorage,
}: WeekViewProps) => {
	const mounted = useRef<number>(0);
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
		if (!mounted.current || mounted.current < 2) {
			++mounted.current;
			return;
		}
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
		<div
			ref={container}
			className="weekView-main-container"
			onClick={(e) => {
				handleWeekViewClick(e, openModal, hideModal, saveToLocalStorage);
			}}
		>
			{nextWeekDates.length && mounted.current > 1 ? (
				<div key={"next"} className={`weekView-main slide ${animationName}`}>
					<HourColumn dateFormatter={dateFormatter} />

					{nextWeekDates.map((date) => {
						return (
							<DayColumn
								key={date.valueOf()}
								date={date}
								dateFormatter={dateFormatter}
								events={events}
								openModal={openModal}
								hideModal={hideModal}
								removeFromLocalStorage={removeFromLocalStorage}
							/>
						);
					})}
				</div>
			) : null}

			<div className={`weekView-main`} key={"current"}>
				<HourColumn dateFormatter={dateFormatter} />

				{currentWeekDates.map((date) => {
					return (
						<DayColumn
							key={date.valueOf()}
							date={date}
							dateFormatter={dateFormatter}
							events={events}
							openModal={openModal}
							hideModal={hideModal}
							removeFromLocalStorage={removeFromLocalStorage}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default WeekView;
