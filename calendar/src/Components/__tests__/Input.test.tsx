import * as React from "react";
import { render, screen, getByRole } from "@testing-library/react";
import Input, { InputTypes } from "../EventForm/Input";

test("nothing", () => {
	expect(true).toBe(true);
});

describe("Input", () => {
	it("should render HTML input element", () => {
		const timestamp = Date.now().toString();
		render(
			<Input
				type={InputTypes.Time}
				inputPlaceholder={"Input"}
				inputValue={timestamp}
				onValueChange={(e) => {}}
			/>
		);

		screen.debug();
		// expect(screen.getByPlaceholderText("Input")).not.toBeInTheDocument();
		expect(screen.getByPlaceholderText("Input")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Input")).toHaveValue(timestamp);
	});
});
