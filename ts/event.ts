import { FormData, saveFormData } from "./database.js";
import { getToday } from "./dateManipulation.js";
import { modalState } from "./state.js";

const TIME_VALIDATION_ERROR_MESSAGE = "Event cannot end before it starts.";
const TITLE_VALIDATION_ERROR_MESSAGE = "Please enter a title.";

const eventModal = document.querySelector("#eventModal") as HTMLDivElement;
const eventForm = document.querySelector("#eventForm") as HTMLFormElement;
const eventButton_create = document.querySelector(
	".create"
) as HTMLButtonElement;
const eventButton_cancel = document.querySelector(
	"#event-cancel"
) as HTMLButtonElement;
const eventButton_save = document.querySelector(
	"#event-save"
) as HTMLButtonElement;
const eventDate = document.querySelector("#event-date") as HTMLInputElement;
const startTime = document.querySelector(
	"#event-startTime"
) as HTMLInputElement;
const endTime = document.querySelector("#event-endTime") as HTMLInputElement;
const title = document.querySelector("#event-title") as HTMLInputElement;

const convertInputToDate = (dateString, timeString) => {
	return Date.parse(`${dateString} ${timeString}`);
};

const collectFormData = () => {
	const inputData: any = {};
	const inputs = Array.from(
		document.querySelectorAll("input[data-key]")
	) as HTMLInputElement[];

	inputs.forEach((input) => {
		const key = input.dataset.key;
		const value = input.value;
		inputData[key] = value || null;
	});

	inputData.startTime = convertInputToDate(
		inputData.startDate,
		inputData.startTime
	);
	inputData.endTime = convertInputToDate(
		inputData.endDate || inputData.startDate,
		inputData.endTime
	);

	const formData = new FormData(inputData);

	return formData;
};

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

export const showFormModal = (date) => {
	if (modalState.value?.dataset.eventId) {
		console.log(modalState.value);
		modalState.value.remove();
	}
	setDateAndTimeInputValues(date);
	eventModal.classList.remove("display-none");
	eventForm.classList.add("slideIn_ltr");
};

const resetForm = () => {
	const errorMessageContainers =
		document.querySelectorAll(".validationMessage");
	errorMessageContainers.forEach((elem) => {
		elem.classList.remove("invalidInput");
	});
	eventForm.reset();
};

const isStartTimeBigger = () => {
	const startTimestamp = convertInputToDate(eventDate.value, startTime.value);
	const endTimestamp = convertInputToDate(eventDate.value, endTime.value);
	if (startTimestamp > endTimestamp) {
		return true;
	} else {
		return false;
	}
};

const validateTimeInput = () => {
	const errorMessageContainer = document.querySelector(
		"[data-timeErrorMessage]"
	);
	const errorMessageText = errorMessageContainer.querySelector("span");
	errorMessageText.innerHTML = TIME_VALIDATION_ERROR_MESSAGE;
	if (isStartTimeBigger()) {
		if (!errorMessageContainer.classList.contains("invalidInput")) {
			errorMessageContainer.classList.add("invalidInput");
		}
		return false;
	} else {
		if (errorMessageContainer.classList.contains("invalidInput")) {
			errorMessageContainer.classList.remove("invalidInput");
		}
		return true;
	}
};

const validateTitleInput = () => {
	const errorMessageContainer = document.querySelector(
		"[data-titleErrorMessage]"
	);
	const errorMessageText = errorMessageContainer.querySelector("span");
	errorMessageText.innerHTML = TITLE_VALIDATION_ERROR_MESSAGE;
	if (!title.value) {
		if (!errorMessageContainer.classList.contains("invalidInput")) {
			errorMessageContainer.classList.add("invalidInput");
		}
		return false;
	} else {
		if (errorMessageContainer.classList.contains("invalidInput")) {
			errorMessageContainer.classList.remove("invalidInput");
		}
		return true;
	}
};

const hideModal = () => {
	resetForm();
	eventForm.classList.add("slideOut_rtl");
	setTimeout(() => {
		eventModal.classList.add("display-none");
		eventForm.classList.remove("slideOut_rtl");
	}, 400);
	modalState.setState(null);
};

export const init = () => {
	title.addEventListener("input", validateTitleInput);
	endTime.addEventListener("input", validateTimeInput);
	startTime.addEventListener("input", validateTimeInput);

	eventModal.addEventListener("click", (e) => {
		if ((e.target as HTMLElement).id === "eventModal") {
			hideModal();
		}
	});

	eventButton_create.addEventListener("click", (e) => {
		showFormModal(getToday());
	});

	eventButton_cancel.addEventListener("click", (e) => {
		hideModal();
	});

	eventButton_save.addEventListener("click", (e) => {
		e.preventDefault();
		if (!validateTitleInput() || !validateTimeInput()) {
			return;
		}
		const formData = collectFormData();
		saveFormData(formData);
		hideModal();
	});
};
