export enum InputTypes {
	Text = "text",
	Date = "date",
	Time = "time",
}
export interface InputProps {
	type: InputTypes;
	inputPlaceholder: string;
	inputValue: any;
	onValueChange: Function;
}
const Input = ({
	type,
	inputPlaceholder,
	inputValue,
	onValueChange,
}: InputProps) => {
	return (
		<input
			className="event-input"
			type={type}
			placeholder={inputPlaceholder}
			value={inputValue}
			onChange={(e) => {
				onValueChange(e.target.value);
			}}
		/>
	);
};

export default Input;
