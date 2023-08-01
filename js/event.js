import { FormData, saveFormData } from "./database.js";
import { MILISECOND_HOUR, getToday } from "./dateManipulation.js";

const TIMESLOT_DURATION = 15;

const eventModal = document.querySelector("#eventModal");
const eventForm = document.querySelector("#eventForm");
const eventButton_create = document.querySelector(".create");
const eventButton_cancel = document.querySelector("#event-cancel");
const eventButton_save = document.querySelector("#event-save");
const eventDate = document.querySelector("#event-date");
const startTime = document.querySelector("#event-startTime");
const endTime = document.querySelector("#event-endTime");

const collectFormData = () => {
	const inputData = {};
	const inputs = document.querySelectorAll("[data-key]");

	inputs.forEach((input) => {
		if (input.required && !input.value) {
			throw `Required field (${input.dataset.key}) skipped`;
		}
		const key = input.dataset.key;
		const value = input.value;
		inputData[key] = value ? value : null;
	});

	const startTime = Date.parse(`${inputData.startDate} ${inputData.startTime}`);
	const endTime = Date.parse(
		`${inputData.endDate || inputData.startDate} ${inputData.endTime}`
	);

	const formData = new FormData({ ...inputData, startTime, endTime });

	console.log(formData);
	console.log(inputData);
	return formData;
};

eventButton_save.addEventListener("click", (e) => {
	try {
		const formData = collectFormData();
		saveFormData(formData);
		toggleDisplay();
	} catch (err) {
		console.error(err);
	}
});

const setDateAndTimeInputValues = (date) => {
	resetForm();
	const time = date.toTimeString().slice(0, 5);
	//use 'lt-LT' as locale to correctly form date as YYYY-MM-DD
	const YMDdate = date.toLocaleDateString("lt-LT", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
	eventDate.value = YMDdate;
	startTime.value = time;
	endTime.value = time;
};

eventButton_create.addEventListener("click", (e) => {
	displayModal(getToday());
});

export const displayModal = (date) => {
	setDateAndTimeInputValues(date);
	toggleDisplay();
};

eventButton_cancel.addEventListener("click", (e) => {
	eventForm.classList.add("slideOut_rtl");
	setTimeout(() => {
		eventModal.classList.add("display-none");
		eventForm.classList.remove("slideOut_rtl");
	}, 400);
});

const toggleDisplay = () => {
	eventModal.classList.toggle("display-none");
	eventForm.classList.add("slideIn_ltr");
};

const resetForm = () => {
	const form = document.querySelector("#eventForm");
	form.reset();
};
