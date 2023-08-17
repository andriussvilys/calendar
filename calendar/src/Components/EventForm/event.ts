import { FormData, saveFormData } from "../../Utils/database";
import { getToday } from "../../Utils/dateManipulation";
import { modalState } from "../../Utils/state";

const TIME_VALIDATION_ERROR_MESSAGE = "Event cannot end before it starts.";
const TITLE_VALIDATION_ERROR_MESSAGE = "Please enter a title.";

const eventModal = document.querySelector("#eventModal") as HTMLDivElement;
const eventForm = document.querySelector("#eventForm") as HTMLFormElement;
const eventButtonCreate = document.querySelector(
	".create"
) as HTMLButtonElement;
const eventButtonCancel = document.querySelector(
	"#event-cancel"
) as HTMLButtonElement;
const eventButtonSave = document.querySelector(
	"#event-save"
) as HTMLButtonElement;
const eventDate = document.querySelector("#event-date") as HTMLInputElement;
const startTime = document.querySelector(
	"#event-startTime"
) as HTMLInputElement;
const endTime = document.querySelector("#event-endTime") as HTMLInputElement;
const title = document.querySelector("#event-title") as HTMLInputElement;

const convertInputToDate = (dateString: string, timeString: string): number => {
	return Date.parse(`${dateString} ${timeString}`);
};

const collectFormData = (): FormData => {
	const inputData: any = {};
	const inputs = Array.from(
		document.querySelectorAll("input[data-key]")
	) as HTMLInputElement[];

	inputs.forEach((input) => {
		const key = input.dataset.key;
		if (key) {
			const value = input.value;
			inputData[key] = value;
		}
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

const setDateAndTimeInputValues = (date: Date): void => {
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

export const showFormModal = (date: Date): void => {
	if (modalState.value?.dataset.eventId) {
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

const toggleErrorMessageElement = (
	errorMessageContainer: Element,
	failCondition: boolean,
	errorMessage: string
): boolean => {
	const errorMessageText = errorMessageContainer.querySelector(
		"span"
	) as HTMLSpanElement;

	errorMessageText.innerHTML = errorMessage;

	if (failCondition) {
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

const validateTimeInput = (): boolean => {
	const errorMessageContainer = document.querySelector(
		"[data-timeErrorMessage]"
	);

	if (errorMessageContainer) {
		return toggleErrorMessageElement(
			errorMessageContainer,
			isStartTimeBigger(),
			TIME_VALIDATION_ERROR_MESSAGE
		);
	}
	return false;
};

const validateTitleInput = (): boolean => {
	const errorMessageContainer = document.querySelector(
		"[data-titleErrorMessage]"
	);
	if (errorMessageContainer) {
		const valRes = toggleErrorMessageElement(
			errorMessageContainer,
			!title.value,
			TITLE_VALIDATION_ERROR_MESSAGE
		);

		return valRes;
	}
	return false;
};

const hideModal = (): void => {
	resetForm();
	eventForm.classList.add("slideOut_rtl");
	setTimeout(() => {
		eventModal.classList.add("display-none");
		eventForm.classList.remove("slideOut_rtl");
	}, 400);
	modalState.setState(null);
};

export const init = (): void => {
	title.addEventListener("input", validateTitleInput);
	endTime.addEventListener("input", validateTimeInput);
	startTime.addEventListener("input", validateTimeInput);

	eventModal.addEventListener("click", (e) => {
		if ((e.target as HTMLElement).id === "eventModal") {
			hideModal();
		}
	});

	eventButtonCreate.addEventListener("click", (e) => {
		showFormModal(getToday());
	});

	eventButtonCancel.addEventListener("click", (e) => {
		hideModal();
	});

	eventButtonSave.addEventListener("click", (e) => {
		e.preventDefault();
		if (!validateTitleInput() || !validateTimeInput()) {
			return;
		}
		const formData = collectFormData();
		saveFormData(formData);
		hideModal();
	});
};
