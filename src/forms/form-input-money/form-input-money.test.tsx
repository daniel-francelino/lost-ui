import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-money.stories";

const { Playground, WithCurrency, OtherLocale, NoDecimals, Bounded, Required, Disabled } =
  composeStories(stories);

describe("FormInputMoney", () => {
  it("starts empty and shows the placeholder", () => {
    render(<Playground />);
    const input = screen.getByRole("textbox", { name: "Amount" });
    expect(input).toHaveValue("");
    expect(input).toHaveAttribute("placeholder", "0.00");
  });

  it("fills the cents first while typing", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1");
    expect(input).toHaveValue("0.01");
    await user.type(input, "2");
    expect(input).toHaveValue("0.12");
    await user.type(input, "345");
    expect(input).toHaveValue("123.45");
    expect(onValueChange).toHaveBeenLastCalledWith(123.45);
  });

  it("removes the last digit with backspace and empties to null", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "125");
    expect(input).toHaveValue("1.25");
    await user.keyboard("{Backspace}");
    expect(input).toHaveValue("0.12");
    await user.keyboard("{Backspace}{Backspace}{Backspace}");

    expect(input).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("ignores characters that are not digits", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1a,b2");

    expect(input).toHaveValue("0.12");
  });

  it("formats the value with the currency symbol", () => {
    render(<WithCurrency />);
    expect(screen.getByRole("textbox")).toHaveValue("$1,234.50");
  });

  it("formats with the locale", () => {
    render(<OtherLocale />);
    const text = (screen.getByRole("textbox") as HTMLInputElement).value;
    expect(text).toContain("R$");
    expect(text).toContain("1.234,50");
  });

  it("uses the decimals of the currency", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<NoDecimals onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("¥1,500");
    await user.type(input, "2");
    expect(onValueChange).toHaveBeenLastCalledWith(15002);
  });

  it("brings the value back inside min and max on blur", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Bounded onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "100000");
    await user.tab();

    expect(onValueChange).toHaveBeenLastCalledWith(100);
    expect(input).toHaveValue("$100.00");
  });

  it("submits the plain amount under the field name", () => {
    const { container } = render(<WithCurrency name="price" />);
    const hidden = container.querySelector('input[type="hidden"][name="price"]');
    expect(hidden).toHaveValue("1234.50");
  });

  it("submits nothing while empty", () => {
    const { container } = render(<Playground name="price" />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it("blocks a form until an amount is given", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Enter an amount")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByRole("textbox"), "500");
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
