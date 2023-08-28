export enum InputTypes {
	Text = "text",
	Date = "date",
	Time = "time",
}
export interface InputProps {
	testid: string;
	type: InputTypes;
	inputPlaceholder: string;
	inputValue: string;
	onValueChange: (value: string) => void;
}
const Input = ({
	testid,
	type,
	inputPlaceholder,
	inputValue,
	onValueChange,
}: InputProps) => {
	return (
		<input
			data-testid={testid}
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
