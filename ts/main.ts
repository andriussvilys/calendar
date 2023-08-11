import { init as initDatabase } from "./database.js";
import { init as initEvent } from "./event.js";
import { init as initHeader } from "./header.js";
import { init as initWeekView } from "./weekView.js";
import { init as initMonth } from "./months.js";
import { createDateFormatter } from "./dateFormatter.js";
import { localeState } from "./state.js";

const initialLang = "en";

const init = (): void => {
	const dateFormatter = createDateFormatter(initialLang);

	localeState.addListener((locale: string) => {
		dateFormatter.changeLocale(locale);
	});

	initDatabase();
	initEvent();
	initHeader(dateFormatter);
	initWeekView(dateFormatter);
	initMonth(dateFormatter);
};

init();
