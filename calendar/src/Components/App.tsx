import { Fragment, useState } from "react";
import { LocaleType } from "../Utils/dateManipulation";
import { Header } from "./Header/header";
import "./main.css";
import MonthView from "./MonthView/MonthView";
import { DateFormatter, createDateFormatter } from "../Utils/dateFormatter";
import { FormData, deleteEvent, getEvents, saveEvent } from "../Utils/database";
import Modal from "./Modal/Modal";
import WeekView from "./WeekView/WeekView";
import CreateEventButton from "./EventForm/CreateEventButton";

function App() {
	const [modalBody, setModalBody] = useState<JSX.Element>(<Fragment />);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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

	const saveToLocalStorage = (event: FormData) => {
		const newState = [...events, event];
		setEvents(newState);
		saveEvent(event);
	};

	const removeFromLocalStorage = (eventId: string) => {
		setEvents(events.filter((storedEvent) => storedEvent.id !== eventId));
		deleteEvent(eventId);
	};
	const openModal = (children: JSX.Element) => {
		setModalBody(children);
		setIsModalVisible(true);
	};
	const hideModal = () => {
		setIsModalVisible(false);
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
						openModal={openModal}
						hideModal={hideModal}
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
