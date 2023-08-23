import { TIMESLOT_DURATION } from "../Components/WeekView/DayColumn/Timeslot";
import { MILISECOND_HOUR } from "./dateManipulation";
import { v4 as uuidv4 } from "uuid";

const findEventById = (eventId: string): FormData | null => {
	const events = getEvents();
	const result = events.find((event: FormData) => {
		return event.id === eventId;
	});
	if (!result) {
		return null;
	}
	return result;
};

export class FormData {
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

export const getEventDuration = (event: FormData): number => {
	return Math.ceil((event.endTime - event.startTime) / (MILISECOND_HOUR / 4));
};

export const getEventTimeslot = (event: FormData): number => {
	const startDate = new Date(event.startTime);
	return Math.floor(startDate.getMinutes() / TIMESLOT_DURATION);
};

export const roundTimestampToHours = (event: FormData): number => {
	return new Date(
		new Date(new Date(event.startTime).setMinutes(0)).setSeconds(0)
	).setMilliseconds(0);
};

export const getEvents = (): FormData[] => {
	const eventsString = localStorage.getItem("events");
	if (eventsString) {
		const parsedEvents: object[] = JSON.parse(eventsString);
		const events: FormData[] = parsedEvents.map((event) => new FormData(event));
		return events;
	}
	return [];
};

export const saveEvent = (event: FormData) => {
	const events = getEvents();
	localStorage.setItem("events", JSON.stringify([...events, event]));
};

export const deleteEvent = (eventId: string) => {
	const event = findEventById(eventId);
	if (event) {
		const events = getEvents();
		const updatedEvents = events.filter((event) => event.id !== eventId);
		localStorage.setItem("events", JSON.stringify(updatedEvents));
	}
};
