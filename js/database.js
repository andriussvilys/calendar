//this module uses UUID v8.1.0 library (CDN). The uuidv4 function comes from there

import { MILISECOND_HOUR, getDayStart } from "./dateManipulation.js";
import { TIMESLOT_DURATION } from "./weekView.js";
import { storageState } from "./state.js";

const initDB = () => {
	if (!localStorage.events) {
		setStorage("events", []);
	}
};

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
	constructor(data) {
		this.id = uuidv4();
		this.title = data.title;
		this.description = data.description;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
	}
}

export const getEventDuration = (event) => {
	return Math.ceil((event.endTime - event.startTime) / (MILISECOND_HOUR / 4));
};
export const getEventTimeslot = (event) => {
	const startDate = new Date(event.startTime);
	return Math.floor(startDate.getMinutes() / TIMESLOT_DURATION);
};
export const getEventCellTimestamp = (event) => {
	return new Date(event.startTime).setMinutes(0).valueOf();
};
export const getEventStartDate = (event) => {
	return getDayStart(event.startTime);
};
export const getEventEndDate = (event) => {
	return getDayStart(event.endTime);
};

const getEvents = () => {
	return JSON.parse(localStorage.getItem("events"));
};

export const saveFormData = (formData) => {
	const events = getEvents();
	events.push(formData);
	setStorage("events", events);
	storageState.setState(formData);
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

// switchWeekView(selectedDate.value, selectedDate.prev);

initDB();
