import { Fragment } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventFormSimple, {
	EventFormInputs,
	formatTimestampToTimeString,
} from "../EventForm/EventForm";

test("nothing", () => {
	expect(true).toBe(true);
});

describe("Form", () => {
	it("should render HTML input element", async () => {
		const user = userEvent.setup();
		render(
			<Fragment>
				<EventFormSimple hideModal={() => {}} timestamp={Date.now()} />
			</Fragment>
		);
		expect(screen.getByTestId(EventFormInputs.TITLE)).toBeInTheDocument();

		await user.type(screen.getByTestId(EventFormInputs.TITLE), "L");

		expect(screen.getByTestId(EventFormInputs.TITLE)).toHaveValue("L");
	});

	it("should change time input value", async () => {
		const timestamp = Date.now();
		let formattedTimestamp = formatTimestampToTimeString(timestamp);

		render(<EventFormSimple hideModal={() => {}} timestamp={Date.now()} />);

		expect(screen.getByTestId(EventFormInputs.START_TIME)).toBeInTheDocument();

		fireEvent.change(screen.getByTestId(EventFormInputs.START_TIME), {
			target: { value: formattedTimestamp },
		});

		expect(screen.getByTestId(EventFormInputs.START_TIME)).toHaveValue(
			formattedTimestamp
		);
	});
});
