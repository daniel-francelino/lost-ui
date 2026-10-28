import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-phone.stories";

const { Playground, Preselected, CustomCountries, Required, Disabled } = composeStories(stories);

describe("FormInputPhone", () => {
  it("shows a country button and a labelled phone input", () => {
    render(<Playground />);
    expect(screen.getByRole("textbox", { name: "Phone" })).toHaveAttribute("type", "tel");
    expect(screen.getByRole("combobox", { name: "Country calling code" })).toHaveTextContent(
      "+351",
    );
  });

  it("joins the calling code and the typed digits", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "912 345-678");

    expect(screen.getByRole("textbox")).toHaveValue("912345678");
    expect(onValueChange).toHaveBeenLastCalledWith("+351912345678");
  });

  it("empties the value when the digits are removed", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "9{Backspace}");

    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("reads the country and the number from the value", () => {
    render(<Preselected />);
    expect(screen.getByRole("combobox", { name: "Country calling code" })).toHaveTextContent("+55");
    expect(screen.getByRole("textbox")).toHaveValue("11987654321");
  });

  it("changes the country and keeps the number", async () => {
    const onValueChange = vi.fn();
    const onCountryChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} onCountryChange={onCountryChange} />);

    await user.click(screen.getByRole("combobox", { name: "Country calling code" }));
    await user.type(await screen.findByRole("searchbox"), "portu");
    await user.click(screen.getByRole("option", { name: /Portugal/ }));

    expect(onCountryChange).toHaveBeenLastCalledWith("PT");
    expect(onValueChange).toHaveBeenLastCalledWith("+35111987654321");
    expect(screen.getByRole("combobox", { name: "Country calling code" })).toHaveTextContent(
      "+351",
    );
  });

  it("finds a country by its calling code", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("combobox", { name: "Country calling code" }));
    await user.type(await screen.findByRole("searchbox"), "+55");

    expect(screen.getByRole("option", { name: /Brazil/ })).toBeInTheDocument();
  });

  it("only offers the countries it was given", async () => {
    const user = userEvent.setup();
    render(<CustomCountries />);

    await user.click(screen.getByRole("combobox", { name: "Country calling code" }));

    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("submits the international number under the field name", () => {
    const { container } = render(<Preselected name="phone" />);
    expect(container.querySelector('input[type="hidden"][name="phone"]')).toHaveValue(
      "+5511987654321",
    );
  });

  it("blocks a form until a number is typed", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Enter a phone number")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "91");
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Number is too short")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByRole("textbox"), "2345678");
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "Country calling code" })).toBeDisabled();
  });
});
