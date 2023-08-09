//this module uses UUID v8.1.0 library (CDN). The uuidv4 function comes from there

import { MILISECOND_HOUR, getDayStart } from "./dateManipulation.js";
import { TIMESLOT_DURATION } from "./weekView.js";
import { storageState } from "./state.js";

export const filterEventsByTimestamp = (timestamp: number): FormData[] => {
	const events = getEvents();
	return events.filter((event: FormData) => {
		return getEventCellTimestamp(event) === timestamp;
	});
};

export const findEventById = (eventId: string): FormData | null => {
	const events = getEvents();
	console.log(events);
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
export const getEventCellTimestamp = (event: FormData): number => {
	return new Date(event.startTime).setMinutes(0).valueOf();
};
export const getEventStartDate = (event: FormData): number => {
	return getDayStart(event.startTime);
};
export const getEventEndDate = (event: FormData): number => {
	return getDayStart(event.endTime);
};

const getEvents = (): FormData[] => {
	const eventsString = localStorage.getItem("events");
	if (eventsString) {
		const parsedEvents: object[] = JSON.parse(eventsString);
		const events: FormData[] = parsedEvents.map((event) => new FormData(event));
		return events;
	}
	return [];
};

export const saveFormData = (formData: FormData): FormData[] => {
	const events: FormData[] = getEvents();
	events.push(formData);
	setStorage("events", events);
	storageState.setState(formData);
	return events;
};

export const removeFormData = (eventId: string) => {
	const event = findEventById(eventId);
	if (event) {
		const events = getEvents();
		const updatedEvents = events.filter((event) => event.id !== eventId);
		setStorage("events", updatedEvents);
		storageState.setState(event);
	}
};

const setStorage = (key: string, value: FormData[]): void => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const init = (): void => {
	if (!localStorage.events) {
		setStorage("events", []);
	}
};