import { Fragment, PropsWithChildren, ReactNode } from "react";
import { FormData, saveFormData } from "../../Utils/database";
import { getToday } from "../../Utils/dateManipulation";
import { modalState } from "../../Utils/state";
import "./event.css";

import timeIcon from "../../images/schedule_FILL0_wght400_GRAD0_opsz48.svg";
import noteIcon from "../../images/notes_FILL0_wght400_GRAD0_opsz48.svg";

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

// const hideModal = (): void => {
// 	resetForm();
// 	eventForm.classList.add("slideOut_rtl");
// 	setTimeout(() => {
// 		eventModal.classList.add("display-none");
// 		eventForm.classList.remove("slideOut_rtl");
// 	}, 400);
// 	modalState.setState(null);
// };

// export const init = (): void => {
// 	title.addEventListener("input", validateTitleInput);
// 	endTime.addEventListener("input", validateTimeInput);
// 	startTime.addEventListener("input", validateTimeInput);

// 	eventModal.addEventListener("click", (e) => {
// 		if ((e.target as HTMLElement).id === "eventModal") {
// 			hideModal();
// 		}
// 	});

// 	eventButtonCreate.addEventListener("click", (e) => {
// 		showFormModal(getToday());
// 	});

// 	eventButtonCancel.addEventListener("click", (e) => {
// 		hideModal();
// 	});

// 	eventButtonSave.addEventListener("click", (e) => {
// 		e.preventDefault();
// 		if (!validateTitleInput() || !validateTimeInput()) {
// 			return;
// 		}
// 		const formData = collectFormData();
// 		saveFormData(formData);
// 		hideModal();
// 	});
// };

interface FormFieldContainerProps extends PropsWithChildren {
	icon: ReactNode;
}

const FormFieldContainer = ({ children, icon }: FormFieldContainerProps) => {
	return (
		<div className="container event-title">
			<div className="event-left">{icon}</div>
			<div className="event-right container">
				<div className="eventInputContainer container">{children}</div>
				<div className="validationMessage">
					<span className="validationMessageText">PLACEHOLDER</span>
				</div>
			</div>
		</div>
	);
};

export interface EventFormProps {
	hideModal: Function;
	saveToLocalStorage: Function;
}

const EventForm = ({ hideModal, saveToLocalStorage }: EventFormProps) => {
	const titleInput = (
		<input
			data-key="title"
			id="event-title"
			className="event-input event-titleInput"
			type="text"
			placeholder="Add title"
			required
		/>
	);
	const dateInput = (
		<input
			key={"startDate"}
			data-key="startDate"
			id="event-date"
			className="event-input"
			type="date"
		/>
	);
	const timeInput = (
		<Fragment key={"timeInput"}>
			<input
				data-key="startTime"
				id="event-startTime"
				className="event-input event-time-input"
				type="time"
			/>
			<span>—</span>
			<input
				data-key="endTime"
				id="event-endTime"
				className="event-input event-time-input"
				type="time"
			/>
		</Fragment>
	);
	const timeIconElement = <img src={timeIcon} alt="clock icon" />;
	return (
		<form
			id="eventForm"
			className="event-container"
			onClick={(e) => e.stopPropagation()}
		>
			<FormFieldContainer children={titleInput} icon={null} />

			<FormFieldContainer
				children={[dateInput, timeInput]}
				icon={timeIconElement}
			/>

			<FormFieldContainer
				children={
					<textarea
						data-key="description"
						id="event-description"
						className="event-input event-textarea"
						placeholder="Description"
					></textarea>
				}
				icon={<img src={noteIcon} alt="note icon" />}
			/>

			<div className="container event-controls">
				<button
					className="button button_secondary button-cancel"
					id="event-cancel"
					type="reset"
					onClick={() => {
						console.log(`typeof hideModal: ${typeof hideModal}`);
						hideModal();
					}}
				>
					Cancel
				</button>
				<button
					className="button button_secondary button-save"
					id="event-save"
					type="submit"
				>
					Save
				</button>
			</div>
		</form>
	);
};

export default EventForm;
