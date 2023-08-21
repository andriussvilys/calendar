import { InputProps } from "./Input";

interface EventTimeInputProps {
	inputValue: any;
	onValueChange: any;
	errorMessage: any;
	isValid: any;
}
const EventTimeInput = ({
	inputValue,
	onValueChange,
	errorMessage,
	isValid,
}: EventTimeInputProps) => {
	return (
		// <div className="event-right container">
		// 	<div className="eventInputContainer container">
		// 		<div className="event-time">
		// 			<input
		// 				type="time"
		// 				value={inputValue.startTime}
		// 				onChange={(e) => {
		// 					onValueChange(e.target.value);
		// 				}}
		// 			/>
		// 			<span>—</span>
		// 			<input
		// 				type="time"
		// 				value={inputValue.endTime}
		// 				onChange={(e) => {
		// 					onValueChange(e.target.value);
		// 				}}
		// 			/>
		// 		</div>
		// 	</div>
		// 	<div className={`validationMessage ${!isValid ? "invalidInput" : ""}`}>
		// 		<span className="validationMessageText">
		// 			{`${!isValid ? errorMessage : ""}`}
		// 		</span>
		// 	</div>
		// </div>
		null
	);
};

export default EventTimeInput;
