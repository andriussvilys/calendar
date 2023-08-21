import { Fragment, useEffect, useRef, useState } from "react";
import { FormData } from "../../Utils/database";
import "./event.css";

import timeIcon from "../../images/schedule_FILL0_wght400_GRAD0_opsz48.svg";
import noteIcon from "../../images/notes_FILL0_wght400_GRAD0_opsz48.svg";
import Input, { InputTypes } from "./Input";
import InputValidator from "./InputValidator";

const TIME_VALIDATION_ERROR_MESSAGE = "Event cannot end before it starts.";
const TITLE_VALIDATION_ERROR_MESSAGE = "Please enter a title.";

const convertInputToDate = (dateString: string, timeString: string): number => {
	console.log({
		dateString,
		timeString,
		date: new Date(`${dateString} ${timeString}`),
		parsed: Date.parse(`${dateString} ${timeString}`),
	});
	return Date.parse(`${dateString} ${timeString}`);
};

// const collectFormData = (inputs: (HTMLInputElement | null)[]): FormData => {
// 	const inputData: any = {};

// 	inputs.forEach((input) => {
// 		const key = input?.dataset.key;
// 		if (key) {
// 			const value = input.value;
// 			inputData[key] = value;
// 		}
// 	});

// 	inputData.startTime = convertInputToDate(
// 		inputData.eventDate,
// 		inputData.startTime
// 	);
// 	inputData.endTime = convertInputToDate(
// 		inputData.endDate || inputData.eventDate,
// 		inputData.endTime
// 	);

// 	console.log(inputData);
// 	const formData = new FormData(inputData);

// 	return formData;
// };

export interface EventFormProps {
	hideModal: Function;
	saveToLocalStorage: Function;
	timestamp: number;
}

interface EventTime {
	startTime: number;
	endTime: number;
}

const formatTimestampToDateString = (timestamp: number): string => {
	return new Date(timestamp).toLocaleDateString("lt-LT", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
};

const formatTimestampToTimeString = (timestamp: number): string => {
	return new Date(timestamp).toTimeString().slice(0, 5);
};

const EventFormSimple = ({
	hideModal,
	saveToLocalStorage,
	timestamp,
}: EventFormProps) => {
	console.log({ timestamp });

	const [title, setTitle] = useState<string>("");
	const [isTitleValid, setIsTitleValid] = useState<boolean>(true);

	const validateTitle = (title: string): boolean => {
		const isValid = title.length > 0;
		setIsTitleValid(isValid);
		return isValid;
	};
	const onTitleInputChange = (value: string): void => {
		setTitle(value);
		validateTitle(value);
	};

	const [eventDate, setEventDate] = useState<string>(
		formatTimestampToDateString(timestamp)
	);

	const [eventTime, setEventTime] = useState({
		startTime: timestamp,
		endTime: timestamp,
	});

	const [isEventTimeValid, setIsEventTimeValid] = useState<boolean>(true);

	const validateEventTime = (eventTime: EventTime) => {
		const isValid = eventTime.startTime <= eventTime.endTime;
		setIsEventTimeValid(isValid);
		return isValid;
	};
	const onEventTimeChange = (value: EventTime): void => {
		const newState = { ...eventTime, ...value };
		setEventTime(newState);
		validateEventTime(newState);
	};

	return (
		<form className="event-container">
			<div className="container">
				<div className="event-left"></div>
				<div className="event-right">
					<Input
						type={InputTypes.Text}
						inputPlaceholder={"Add title"}
						inputValue={title}
						onValueChange={onTitleInputChange}
					/>
					<InputValidator
						errorMessage={TITLE_VALIDATION_ERROR_MESSAGE}
						isValid={isTitleValid}
					/>
				</div>
			</div>

			<div className="container">
				<div className="event-left">
					<img src={timeIcon} alt="clock icon" />
				</div>

				<div className="event-right">
					<div className="container">
						<Input
							type={InputTypes.Date}
							inputPlaceholder={""}
							inputValue={eventDate}
							onValueChange={setEventDate}
						/>
						<Input
							type={InputTypes.Time}
							inputPlaceholder={""}
							inputValue={formatTimestampToTimeString(eventTime.startTime)}
							onValueChange={(value: string) => {
								onEventTimeChange({
									...eventTime,
									startTime: convertInputToDate(eventDate, value),
								});
							}}
						/>
						<Input
							type={InputTypes.Time}
							inputPlaceholder={""}
							inputValue={formatTimestampToTimeString(eventTime.endTime)}
							onValueChange={(value: string) => {
								onEventTimeChange({
									...eventTime,
									endTime: convertInputToDate(eventDate, value),
								});
							}}
						/>
					</div>
					<InputValidator
						errorMessage={TIME_VALIDATION_ERROR_MESSAGE}
						isValid={isEventTimeValid}
						// isValid={eventTime.startTime <= eventTime.endTime}
					/>
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
						if (validateTitle(title) && validateEventTime(eventTime)) {
							saveToLocalStorage(
								new FormData({
									startTime: eventTime.startTime,
									endTime: eventTime.endTime,
									title,
								})
							);
							hideModal();
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
