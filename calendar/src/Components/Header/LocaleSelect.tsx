import { LocaleType } from "../../Utils/dateManipulation";

interface LocaleSelectProps {
	onLocaleChange: (newLocale: LocaleType) => void;
}

const LocaleSelect = ({ onLocaleChange }: LocaleSelectProps) => {
	const handleOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onLocaleChange(e.target.value as LocaleType);
	};
	return (
		<div className="localeSelectorContainer">
			<select
				onChange={(e) => {
					handleOptionSelect(e);
				}}
				id="localeSelector"
				className="localeSelector"
			>
				<option value={LocaleType.US}>🇺🇸 US</option>
				<option value={LocaleType.LT}>🇱🇹 LT</option>
				<option value={LocaleType.AF}>✅ afghanistan</option>
			</select>
		</div>
	);
};

export default LocaleSelect;
