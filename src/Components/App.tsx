import { useState } from "react";
import { LocaleType } from "../Utils/dateManipulation";
import "./main.css";
import MonthView from "./MonthView/MonthView";
import { DateFormatter, createDateFormatter } from "../Utils/dateFormatter";
import { EventData, getEvents } from "../Utils/database";
import CreateEventButton from "./EventForm/CreateEventButton";
import { ModalContextProvider } from "./Modal/ModalContext";
import { Header } from "./Header/header";
import WeekView from "./WeekView/weekView";

function App() {
	const [dateFormatter, setDateFormatter] = useState<DateFormatter>(
		createDateFormatter(LocaleType.US)
	);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [events, setEvents] = useState<EventData[]>(getEvents());

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

	return (
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
	);
}

export default App;
