import { Fragment, useState } from "react";
import { LocaleType } from "../Utils/dateManipulation";
import { Header } from "./Header/header";
import "./main.css";
import MonthView from "./MonthView/MonthView";
import { DateFormatter, createDateFormatter } from "../Utils/dateFormatter";
import WeekView from "./WeekView/weekView";
import { FormData, getEvents } from "../Utils/database";

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
	const onLocalStorageChange = (event: FormData) => {
		setEvents([...events, event]);
		localStorage.setItem("events", JSON.stringify(events));
	};

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
						onLocalStorageChange={onLocalStorageChange}
						events={events}
					/>
				</section>
			</main>
		</Fragment>
	);
}

export default App;
