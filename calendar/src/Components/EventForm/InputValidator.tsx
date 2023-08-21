interface InputValidatorProps {
	errorMessage: string;
	isValid: boolean;
}

const InputValidator = ({ errorMessage, isValid }: InputValidatorProps) => {
	return (
		<div className={`validationMessage ${!isValid ? "invalidInput" : ""}`}>
			<span className="validationMessageText">
				{`${!isValid ? errorMessage : ""}`}
			</span>
		</div>
	);
};

export default InputValidator;
