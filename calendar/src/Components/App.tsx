import { useState } from "react";
import { LocaleType } from "../Utils/dateManipulation";
import { Header } from "./Header/header";
import "./main.css";

function App() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [locale, setLocale] = useState<LocaleType>(LocaleType.US);

	const onLocaleChange = (newLocale: LocaleType) => {
		setLocale(newLocale);
	};
	const onSelectedDateChange = (newDate: Date) => {
		setSelectedDate(newDate);
	};

	return (
		<Header
			locale={locale}
			selectedDate={selectedDate}
			onLocaleChange={onLocaleChange}
			onSelectedDateChange={onSelectedDateChange}
		/>
	);
}

export default App;
