import { init as initDatabase } from "./database.js";
import { init as initEvent } from "./event.js";
import { init as initHeader } from "./header.js";
import { init as initWeekView } from "./weekView.js";
import { init as initMonth } from "./months.js";
import { init as initModal } from "./modal.js";
import { createDateFormatter } from "./date-formatter.js";
import { localeState } from "./state.js";
const initialLang = "en";
const init = () => {
    const dateFormatter = createDateFormatter(initialLang);
    localeState.addListener((locale) => {
        dateFormatter.changeLocale(locale);
    });
    initDatabase();
    initEvent();
    initHeader(dateFormatter);
    initWeekView(dateFormatter);
    initMonth(dateFormatter);
    initModal();
};
init();
