import { useEffect, useRef, useState } from "react";
import { FormData } from "../../Utils/database";
import "./event.css";

import timeIcon from "../../images/schedule_FILL0_wght400_GRAD0_opsz48.svg";
import noteIcon from "../../images/notes_FILL0_wght400_GRAD0_opsz48.svg";

const TIME_VALIDATION_ERROR_MESSAGE = "Event cannot end before it starts.";
const TITLE_VALIDATION_ERROR_MESSAGE = "Please enter a title.";

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
    inputData.startTime,
  );
  inputData.endTime = convertInputToDate(
    inputData.endDate || inputData.startDate,
    inputData.endTime,
  );

  console.log(inputData);
  const formData = new FormData(inputData);

  return formData;
};

const isStartTimeBigger = (
  dateInput: string,
  startTimeInput: string,
  endTimeInput: string,
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
  errorMessage: string,
): boolean => {
  const errorMessageText = errorMessageContainer?.querySelector(
    "span",
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

export interface EventFormProps {
  hideModal: Function;
  saveToLocalStorage: Function;
  timestamp: number;
}

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
      TIME_VALIDATION_ERROR_MESSAGE,
    );
  };

  const validateTitleInput = (value: string): boolean => {
    return toggleErrorMessageElement(
      titleValidationRef.current,
      value.length === 0,
      TITLE_VALIDATION_ERROR_MESSAGE,
    );
  };

  const onTitleInputChange = (value: string): void => {
    setTitle(value);
    validateTitleInput(value);
  };

  useEffect(() => {
    validateTimeInput();
  }, [startTime, endTime]);

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
                onTitleInputChange(e.target.value);
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
