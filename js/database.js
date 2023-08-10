//this module uses UUID v8.1.0 library (CDN). The uuidv4 function comes from there
import { MILISECOND_HOUR, getDayStart } from "./dateManipulation.js";
import { TIMESLOT_DURATION } from "./weekView.js";
import { storageState } from "./state.js";
export const filterEventsByTimestamp = (timestamp) => {
    const events = getEvents();
    return events.filter((event) => {
        return getEventCellTimestamp(event) === timestamp;
    });
};
export const findEventById = (eventId) => {
    const events = getEvents();
    console.log(events);
    const result = events.find((event) => {
        return event.id === eventId;
    });
    if (!result) {
        return null;
    }
    return result;
};
export class FormData {
    constructor(data) {
        this.id = data.id || window.uuidv4();
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
    const eventsString = localStorage.getItem("events");
    if (eventsString) {
        const parsedEvents = JSON.parse(eventsString);
        const events = parsedEvents.map((event) => new FormData(event));
        return events;
    }
    return [];
};
export const saveFormData = (formData) => {
    const events = getEvents();
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
