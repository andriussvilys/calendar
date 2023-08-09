import { init as initDatabase } from "./database.js";
import { init as initEvent } from "./event.js";
import { init as initHeader } from "./header.js";
import { init as initWeekView } from "./weekView.js";
import { init as initMonth } from "./months.js";
import { init as initModal } from "./modal.js";

const init = (): void => {
	initDatabase();
	initEvent();
	initHeader();
	initWeekView();
	initMonth();
	initModal();
};

init();
