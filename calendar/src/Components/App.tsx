import { Fragment, useState } from "react";
import { LocaleType } from "../Utils/dateManipulation";
import { Header } from "./Header/header";
import "./main.css";
import MonthView from "./MonthView/MonthView";
import { DateFormatter, createDateFormatter } from "../Utils/dateFormatter";
import { FormData, getEvents } from "../Utils/database";
import WeekView from "./WeekView/WeekView";
import CreateEventButton from "./EventForm/CreateEventButton";

window.addEventListener("storage", (e) => {
	console.log(e.newValue);
});

function App() {
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

	const saveToLocalStorage = (event: FormData) => {};

	const removeFromLocalStorage = (eventId: string) => {};

	window.addEventListener("storage", (e) => {
		if (e.newValue) {
			setEvents(JSON.parse(e.newValue));
		}
	});

	return (
		<Fragment>
			<Header
				dateFormatter={dateFormatter}
				selectedDate={selectedDate}
				onLocaleChange={onLocaleChange}
				onSelectedDateChange={onSelectedDateChange}
			/>
			<main className="main">
				<aside className="container sideBar">
					<CreateEventButton saveToLocalStorage={saveToLocalStorage} />
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
						openModal={() => {}}
						hideModal={() => {}}
						saveToLocalStorage={saveToLocalStorage}
						removeFromLocalStorage={removeFromLocalStorage}
						timestamp={0}
					/>
				</section>
			</main>
		</Fragment>
	);
}

export default App;
