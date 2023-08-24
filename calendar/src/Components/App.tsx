import { Fragment, ReactNode, useState } from "react";
import { LocaleType } from "../Utils/dateManipulation";
import { Header } from "./Header/Header";
import "./main.css";
import MonthView from "./MonthView/MonthView";
import { DateFormatter, createDateFormatter } from "../Utils/dateFormatter";
import { FormData, getEvents } from "../Utils/database";
import WeekView from "./WeekView/WeekView";
import CreateEventButton from "./EventForm/CreateEventButton";
import { createContext } from "react";
import Modal, { ModalProps } from "./Modal/Modal";
import { ModalContext, ModalContextProvider } from "./Modal/ModalContext";

function App() {
	// const [isModalVisible, setIsVisible] = useState<boolean>(false);
	// const [modalChildren, setChildren] = useState<ReactNode | null>(null);

	const [dateFormatter, setDateFormatter] = useState<DateFormatter>(
		createDateFormatter(LocaleType.US)
	);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [events, setEvents] = useState<FormData[]>(getEvents());

	const onLocaleChange = (newLocale: LocaleType) => {
		setDateFormatter(createDateFormatter(newLocale));
	};
	const onSelectedDateChange = (newDate: Date) => {
		setSelectedDate(newDate);
	};

	window.addEventListener("storage", (e) => {
		if (e.newValue) {
			setEvents(JSON.parse(e.newValue));
		}
	});

	// const setModalVisibility = (value: boolean): void => {
	// 	setIsVisible(value);
	// };
	// const setModalChildren = (value: ReactNode | null): void => {
	// 	setChildren(value);
	// };

	return (
		<Fragment>
			<ModalContextProvider>
				<Header
					dateFormatter={dateFormatter}
					selectedDate={selectedDate}
					onLocaleChange={onLocaleChange}
					onSelectedDateChange={onSelectedDateChange}
				/>
				<main className="main">
					<aside className="container sideBar">
						<CreateEventButton />
						<MonthView
							dateFormatter={dateFormatter}
							selectedDate={selectedDate}
							onDateChange={onSelectedDateChange}
						/>
					</aside>
					<section className="weekView-wrapper">
						<WeekView
							selectedDate={selectedDate}
							dateFormatter={dateFormatter}
							events={events}
						/>
					</section>
				</main>
			</ModalContextProvider>
		</Fragment>
	);
}

export default App;
