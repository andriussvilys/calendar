import { getToday } from "./dateManipulation";

class State {
	value: any;
	prev: typeof this.value;
	listeners: Function[];
	constructor(data: any) {
		this.value = data;
		this.prev = null;
		this.listeners = [];
	}
	addListener(cb: Function) {
		this.listeners.push(cb);
	}
	setState(value: any) {
		this.prev = this.value;
		this.value = value;
		this.listeners.forEach((callback: Function) =>
			callback(this.value, this.prev)
		);
	}
}

export const selectedDate = new State(getToday());
export const selectedMonth = new State(getToday());
export const storageState = new State(getToday());
export const modalState = new State(null);
export const localeState = new State("us-US");
