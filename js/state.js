import { getToday } from "./dateManipulation.js";
class State {
    constructor(data) {
        this.value = data;
        this.prev = null;
        this.listeners = [];
    }
    addListener(cb) {
        this.listeners.push(cb);
    }
    setState(value) {
        this.prev = this.value;
        this.value = value;
        this.listeners.forEach((callback) => callback(this.value, this.prev));
    }
}
export const selectedDate = new State(getToday());
export const selectedMonth = new State(getToday());
export const storageState = new State(getToday());
export const modalState = new State(null);
export const localeState = new State("us-US");
