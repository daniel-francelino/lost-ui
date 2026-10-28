import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import { isValidPhone } from "./form-input-phone";
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
    expect(await screen.findByText("Enter a valid number")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByRole("textbox"), "2345678");
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows a flag for the selected country and in the list", async () => {
    const user = userEvent.setup();
    const { container } = render(<Playground />);
    expect(
      screen.getByRole("combobox", { name: "Country calling code" }).querySelector("svg"),
    ).not.toBeNull();

    await user.click(screen.getByRole("combobox", { name: "Country calling code" }));
    expect(container.ownerDocument.querySelector('[role="option"] svg')).not.toBeNull();
  });

  it("lists every country of libphonenumber-js by default", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("combobox", { name: "Country calling code" }));

    expect(screen.getAllByRole("option").length).toBeGreaterThan(200);
  });

  describe("isValidPhone", () => {
    it("accepts a complete number of its country", () => {
      expect(isValidPhone("+351912345678")).toBe(true);
      expect(isValidPhone("+5511987654321")).toBe(true);
    });

    it("rejects an incomplete or empty number", () => {
      expect(isValidPhone("+35191")).toBe(false);
      expect(isValidPhone("")).toBe(false);
    });
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "Country calling code" })).toBeDisabled();
  });
});
