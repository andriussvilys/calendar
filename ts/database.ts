//this module uses UUID v8.1.0 library (CDN). The uuidv4 function comes from there

import { MILISECOND_HOUR, getDayStart } from "./dateManipulation.js";
import { TIMESLOT_DURATION } from "./weekView.js";
import { storageState } from "./state.js";

export const findEventByTimestamp = (timestamp) => {
	const events = getEvents();
	return events.filter((event) => {
		return getEventCellTimestamp(event) === timestamp;
	});
};

export const findEventById = (eventId) => {
	const events = getEvents();
	return events.find((event) => {
		return event.id === eventId;
	});
};

export class FormData {
	id: string;
	title: string;
	description: string;
	startTime: number;
	endTime: number;
	constructor(data) {
		this.id = uuidv4();
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

const getEvents = () => {
	const rawEvents = JSON.parse(localStorage.getItem("events"));
	return rawEvents.map((event) => new FormData(event));
};

export const saveFormData = (formData: FormData): FormData[] => {
	const events: FormData[] = getEvents();
	events.push(formData);
	setStorage("events", events);
	storageState.setState(formData);
	return events;
};

export const removeFormData = (eventId) => {
	const event = findEventById(eventId);
	if (event) {
		const events = getEvents();
		const updatedEvents = events.filter((event) => event.id !== eventId);
		setStorage("events", updatedEvents);
		storageState.setState(event);
	}
};

const setStorage = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const init = () => {
	if (!localStorage.events) {
		setStorage("events", []);
	}
};
