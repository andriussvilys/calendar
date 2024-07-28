import { TIMESLOT_DURATION } from "../Components/WeekView/DayColumn/Timeslot";
import { MILISECOND_HOUR } from "./dateManipulation";
import { v4 as uuidv4 } from "uuid";

const findEventById = (eventId: string): EventData | null => {
	const events = getEvents();
	const result = events.find((event: EventData) => {
		return event.id === eventId;
	});
	if (!result) {
		return null;
	}
	return result;
};

export class EventData {
	id: string;
	title: string;
	description: string;
	startTime: number;
	endTime: number;
	constructor(data: any) {
		this.id = (data.id as string) || uuidv4();
		this.title = data.title;
		this.description = data.description;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
	}
}

export const getEventDuration = (event: EventData): number => {
	return Math.ceil((event.endTime - event.startTime) / (MILISECOND_HOUR / 4));
};

export const getEventTimeslot = (event: EventData): number => {
	const startDate = new Date(event.startTime);
	return Math.floor(startDate.getMinutes() / TIMESLOT_DURATION);
};

export const roundTimestampToHours = (event: EventData): number => {
	return new Date(
		new Date(new Date(event.startTime).setMinutes(0)).setSeconds(0)
	).setMilliseconds(0);
};

export const getEvents = (): EventData[] => {
	const eventsString = localStorage.getItem("events");
	if (eventsString) {
		const parsedEvents: object[] = JSON.parse(eventsString);
		const events: EventData[] = parsedEvents.map(
			(event) => new EventData(event)
		);
		return events;
	}
	return [];
};

export const saveEvent = (event: EventData) => {
	const events = getEvents();
	localStorage.setItem("events", JSON.stringify([...events, event]));
	dispatchEvent(
		new StorageEvent("storage", {
			key: event.id,
			newValue: localStorage.getItem("events"),
		})
	);
};

export const deleteEvent = (eventId: string) => {
	const event = findEventById(eventId);
	if (event) {
		const events = getEvents();
		const updatedEvents = events.filter((event) => event.id !== eventId);
		localStorage.setItem("events", JSON.stringify(updatedEvents));
		dispatchEvent(
			new StorageEvent("storage", {
				newValue: localStorage.getItem("events"),
			})
		);
	}
};
