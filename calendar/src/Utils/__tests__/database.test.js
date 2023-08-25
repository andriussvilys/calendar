import { EventData, getEventDuration } from "../database";

describe("getEventDuration", () => {
	const testEvent = new EventData({
		id: 0,
		title: "test event",
		description: "description text",
		startTime: new Date(2023, 8, 23, 10, 0, 0, 0),
		endTime: new Date(2023, 8, 23, 11, 0, 0, 0),
	});
	const testEvent2 = new EventData({
		id: 0,
		title: "test event",
		description: "description text",
		startTime: new Date(2023, 8, 23, 11, 0, 0, 0),
		endTime: new Date(2023, 8, 23, 10, 45, 0, 0),
	});
	const testEvent3 = new EventData({
		id: 0,
		title: "test event",
		description: "description text",
		startTime: new Date(2023, 8, 23, 10, 0, 0, 0),
		endTime: new Date(2023, 8, 23, 10, 45, 45, 500),
	});
	it("should return correct duration", () => {
		expect(getEventDuration(testEvent)).toBe(4);
		expect(getEventDuration(testEvent2)).toBe(-1);
		expect(getEventDuration(testEvent3)).toBe(4);
	});
	it("should always return a result", () => {
		expect(getEventDuration(testEvent)).toBeTruthy();
	});
});
