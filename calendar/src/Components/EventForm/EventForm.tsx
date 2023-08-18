import {
	Fragment,
	PropsWithChildren,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
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

const eventDate = document.querySelector("#event-date") as HTMLInputElement;
const startTime = document.querySelector(
	"#event-startTime"
) as HTMLInputElement;
const endTime = document.querySelector("#event-endTime") as HTMLInputElement;
const title = document.querySelector("#event-title") as HTMLInputElement;

const convertInputToDate = (dateString: string, timeString: string): number => {
	return Date.parse(`${dateString} ${timeString}`);
};

const collectFormData = (inputs: (HTMLInputElement | null)[]): FormData => {
	const inputData: any = {};

	inputs.forEach((input) => {
		const key = input?.dataset.key;
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

	console.log(inputData);
	const formData = new FormData(inputData);

	return formData;
};

const setDateAndTimeInputValues = (date: Date): void => {
	// resetForm();
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

// export const showFormModal = (date: Date): void => {
// 	if (modalState.value?.dataset.eventId) {
// 		modalState.value.remove();
// 	}
// 	setDateAndTimeInputValues(date);
// 	eventModal.classList.remove("display-none");
// 	eventForm.classList.add("slideIn_ltr");
// };

// const resetForm = () => {
// 	const errorMessageContainers =
// 		document.querySelectorAll(".validationMessage");
// 	errorMessageContainers.forEach((elem) => {
// 		elem.classList.remove("invalidInput");
// 	});
// 	eventForm.reset();
// };

const isStartTimeBigger = (
	dateInput: string,
	startTimeInput: string,
	endTimeInput: string
): boolean => {
	const startTimestamp = convertInputToDate(dateInput, startTimeInput);
	const endTimestamp = convertInputToDate(dateInput, endTimeInput);
	if (startTimestamp > endTimestamp) {
		return true;
	} else {
		return false;
	}
};

const toggleErrorMessageElement = (
	errorMessageContainer: Element | null,
	failCondition: boolean,
	errorMessage: string
): boolean => {
	const errorMessageText = errorMessageContainer?.querySelector(
		"span"
	) as HTMLSpanElement;

	errorMessageText.innerHTML = errorMessage;

	if (failCondition) {
		if (!errorMessageContainer?.classList.contains("invalidInput")) {
			errorMessageContainer?.classList.add("invalidInput");
		}
		return false;
	} else {
		if (errorMessageContainer?.classList.contains("invalidInput")) {
			errorMessageContainer?.classList.remove("invalidInput");
		}
		return true;
	}
};

const validateTimeInput = (
	errorMessageContainer: HTMLElement | null,
	startTime: number,
	endTime: number
): boolean => {
	if (errorMessageContainer) {
		return toggleErrorMessageElement(
			errorMessageContainer,
			startTime < endTime,
			TIME_VALIDATION_ERROR_MESSAGE
		);
	}
	return false;
};

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

const validateTitleInput = (
	errorMessageContainer: HTMLElement | null
): boolean => {
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

// const validateInput = (
// 	errorMessageContainer: HTMLElement | null,
// 	failCondition: boolean,
// 	errorMessage: string
// ): boolean => {
// 	if (errorMessageContainer) {
// 		const valRes = toggleErrorMessageElement(
// 			errorMessageContainer,
// 			!title.value,
// 			TITLE_VALIDATION_ERROR_MESSAGE
// 		);

// 		return valRes;
// 	}
// 	return false;
// };

const TitleInput = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const errorMessageContainerRef = useRef<HTMLDivElement>(null);
	const titleInput = (
		<input
			data-key="title"
			id="event-title"
			className="event-input event-titleInput"
			type="text"
			placeholder="Add title"
			required
			onChange={(e) => {
				// validateInput(
				// 	errorMessageContainerRef.current,
				// 	!!inputRef.current?.value,
				// 	TITLE_VALIDATION_ERROR_MESSAGE
				// );
			}}
			ref={inputRef}
		/>
	);
	return (
		<div className="container event-title">
			<div className="event-left"></div>
			<div className="event-right container">
				<div className="eventInputContainer container">{titleInput}</div>
				<div ref={errorMessageContainerRef} className="validationMessage">
					<span className="validationMessageText">PLACEHOLDER</span>
				</div>
			</div>
		</div>
	);
};

export interface EventFormProps {
	hideModal: Function;
	saveToLocalStorage: Function;
	timestamp: number;
}

const EventForm = ({
	hideModal,
	saveToLocalStorage,
	timestamp,
}: EventFormProps) => {
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
			{/* <FormFieldContainer children={titleInput} icon={null} /> */}
			<TitleInput />

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
					type="reset"
					onClick={() => {
						hideModal();
					}}
				>
					Cancel
				</button>
				<button
					className="button button_secondary button-save"
					type="submit"
					onClick={() => {
						// saveToLocalStorage(collectFormData());
					}}
				>
					Save
				</button>
			</div>
		</form>
	);
};

const EventFormSimple = ({
	hideModal,
	saveToLocalStorage,
	timestamp,
}: EventFormProps) => {
	const titleInputRef = useRef<HTMLInputElement>(null);
	const dateInputRef = useRef<HTMLInputElement>(null);
	const startTimeInputRef = useRef<HTMLInputElement>(null);
	const endTimeInputRef = useRef<HTMLInputElement>(null);
	const inputs = [
		titleInputRef.current,
		dateInputRef.current,
		startTimeInputRef.current,
		endTimeInputRef.current,
	];
	const timeValidationRef = useRef<HTMLDivElement>(null);
	const titleValidationRef = useRef<HTMLDivElement>(null);

	const date = new Date(timestamp);
	const time = date.toTimeString().slice(0, 5);
	const YMDdate = date.toLocaleDateString("lt-LT", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
	const [startDate, setStartDate] = useState<string>(YMDdate);
	const [startTime, setStartTime] = useState<string>(time);
	const [endTime, setEndTime] = useState<string>(time);
	const [title, setTitle] = useState<string>("");

	const validateTimeInput = (): boolean => {
		return toggleErrorMessageElement(
			timeValidationRef.current,
			isStartTimeBigger(startDate, startTime, endTime),
			TIME_VALIDATION_ERROR_MESSAGE
		);
	};

	const validateTitleInput = (): boolean => {
		return toggleErrorMessageElement(
			titleValidationRef.current,
			!!!titleInputRef.current?.value,
			TITLE_VALIDATION_ERROR_MESSAGE
		);
	};

	useEffect(() => {
		validateTimeInput();
	}, [startTime, endTime]);

	useEffect(() => {
		validateTitleInput();
	}, [title]);

	//use 'lt-LT' as locale to correctly form date as YYYY-MM-DD
	return (
		<form id="eventForm" className="event-container">
			<div className="container event-title">
				<div className="event-left"></div>
				<div className="event-right container">
					<div className="eventInputContainer container">
						<input
							ref={titleInputRef}
							data-key="title"
							id="event-title"
							className="event-input event-titleInput"
							type="text"
							placeholder="Add title"
							required
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
						/>
					</div>
					<div className="validationMessage" ref={titleValidationRef}>
						<span className="validationMessageText">PLACEHOLDER</span>
					</div>
				</div>
			</div>

			<div className="container event-timeAndDate">
				<div className="event-left">
					<img src={timeIcon} alt="clock icon" />
				</div>

				<div className="event-right container">
					<div className="eventInputContainer container">
						<input
							ref={dateInputRef}
							data-key="startDate"
							id="event-date"
							className="event-input"
							type="date"
							value={startDate}
							onChange={(e) => {
								setStartDate(e.target.value);
							}}
						/>
						<div className="event-time">
							<input
								ref={startTimeInputRef}
								data-key="startTime"
								id="event-startTime"
								className="event-input event-time-input"
								type="time"
								value={startTime}
								onChange={(e) => {
									setStartTime(e.target.value);
								}}
							/>
							<span>—</span>
							<input
								ref={endTimeInputRef}
								data-key="endTime"
								id="event-endTime"
								className="event-input event-time-input"
								type="time"
								value={endTime}
								onChange={(e) => {
									setEndTime(e.target.value);
								}}
							/>
						</div>
					</div>
					<div className="validationMessage" ref={timeValidationRef}>
						<span className="validationMessageText">PLACEHOLDER</span>
					</div>
				</div>
			</div>

			<div className="container event-description">
				<div className="event-left">
					<img src={noteIcon} alt="notebook icon" />
				</div>

				<div className="event-right">
					<textarea
						data-key="description"
						id="event-description"
						className="event-input event-textarea"
						placeholder="Description"
					></textarea>
				</div>
			</div>

			<div className="container event-controls">
				<button
					className="button button_secondary button-cancel"
					type="reset"
					onClick={() => {
						hideModal();
					}}
				>
					Cancel
				</button>
				<button
					className="button button_secondary button-save"
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						if (validateTimeInput()) {
							console.log(collectFormData(inputs));
						}
					}}
				>
					Save
				</button>
			</div>
		</form>
	);
};

export default EventFormSimple;
