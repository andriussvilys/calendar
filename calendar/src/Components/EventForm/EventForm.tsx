import { useRef, useState } from "react";
import { EventData, saveEvent } from "../../Utils/database";
import "./event.css";

import timeIcon from "../../images/schedule_FILL0_wght400_GRAD0_opsz48.svg";
import noteIcon from "../../images/notes_FILL0_wght400_GRAD0_opsz48.svg";
import Input, { InputTypes } from "./Input";
import InputValidator from "./InputValidator";
import FormBlock from "./FormBlock";

const TIME_VALIDATION_ERROR_MESSAGE = "Event cannot end before it starts.";
const TITLE_VALIDATION_ERROR_MESSAGE = "Please enter a title.";

const convertInputToDate = (dateString: string, timeString: string): number => {
	return Date.parse(`${dateString} ${timeString}`);
};

export interface EventFormProps {
	hideModal: () => void;
	timestamp: number;
}

interface EventTime {
	startTime: number;
	endTime: number;
}

export const formatTimestampToDateString = (timestamp: number): string => {
	return new Date(timestamp).toLocaleDateString("lt-LT", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
};

export const formatTimestampToTimeString = (timestamp: number): string => {
	return new Date(timestamp).toTimeString().slice(0, 5);
};

const validateTitle = (title: string): boolean => {
	const isValid = title.length > 0;
	return isValid;
};
const validateEventTime = (eventTime: EventTime) => {
	const isValid = eventTime.startTime <= eventTime.endTime;
	return isValid;
};

export enum EventFormInputs {
	TITLE = "titleInput",
	START_DATE = "startDateInput",
	START_TIME = "startTimeInput",
	END_TIME = "endTimeInput",
	DESCRIPTION = "descriptionInput",
}

const EventFormSimple = ({ hideModal, timestamp }: EventFormProps) => {
	const [title, setTitle] = useState<string>("");

	const [eventDate, setEventDate] = useState<string>(
		formatTimestampToDateString(timestamp)
	);

	const [eventTime, setEventTime] = useState({
		startTime: timestamp,
		endTime: timestamp,
	});

	const onTitleInputChange = (value: string): void => {
		setTitle(value);
	};

	const onEventTimeChange = (value: EventTime): void => {
		const newState = { ...eventTime, ...value };
		setEventTime(newState);
	};

	const descriptionRef = useRef<HTMLTextAreaElement>(null);

	return (
		<form className="event-container">
			<FormBlock icon={null}>
				<Input
					testid={EventFormInputs.TITLE}
					type={InputTypes.Text}
					inputPlaceholder={"Add title"}
					inputValue={title}
					onValueChange={onTitleInputChange}
				/>
				<InputValidator
					errorMessage={TITLE_VALIDATION_ERROR_MESSAGE}
					isValid={validateTitle(title)}
				/>
			</FormBlock>

			<FormBlock icon={<img src={timeIcon} alt="clock icon" />}>
				<div className="container">
					<Input
						testid={EventFormInputs.START_DATE}
						type={InputTypes.Date}
						inputPlaceholder={""}
						inputValue={eventDate}
						onValueChange={setEventDate}
					/>
					<Input
						testid={EventFormInputs.START_TIME}
						type={InputTypes.Time}
						inputPlaceholder={""}
						inputValue={formatTimestampToTimeString(eventTime.startTime)}
						onValueChange={(value: string) => {
							console.log(value);
							onEventTimeChange({
								...eventTime,
								startTime: convertInputToDate(eventDate, value),
							});
						}}
					/>
					<Input
						testid={EventFormInputs.END_TIME}
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
					isValid={validateEventTime(eventTime)}
				/>
			</FormBlock>

			<FormBlock icon={<img src={noteIcon} alt="notebook icon" />}>
				<div className="event-description">
					<textarea
						data-testid={EventFormInputs.DESCRIPTION}
						ref={descriptionRef}
						data-key="description"
						id="event-description"
						className="event-input event-textarea"
						placeholder="Description"
					></textarea>
				</div>
			</FormBlock>

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
							saveEvent(
								new EventData({
									startTime: eventTime.startTime,
									endTime: eventTime.endTime,
									title,
									description: descriptionRef.current?.value,
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
