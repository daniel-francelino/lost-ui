import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-country-select.stories";

const { Playground, Preselected, Portuguese, CustomList, Required, Disabled } =
  composeStories(stories);

describe("FormCountrySelect", () => {
  it("renders a labelled combobox", () => {
    render(<Playground />);
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute(
      "placeholder",
      "Search a country",
    );
  });

  it("shows the flag and name of the chosen country", () => {
    render(<Preselected />);
    expect(screen.getByRole("combobox")).toHaveValue("🇵🇹 Portugal");
  });

  it("names the countries in the given locale", () => {
    render(<Portuguese />);
    expect(screen.getByRole("combobox")).toHaveValue("🇧🇷 Brasil");
  });

  it("filters while typing and reports the ISO code", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByRole("combobox"), "portu");
    await user.click(screen.getByRole("option", { name: /Portugal/ }));

    expect(onValueChange).toHaveBeenLastCalledWith("PT");
    expect(screen.getByRole("combobox")).toHaveValue("🇵🇹 Portugal");
  });

  it("only offers the countries it was given", async () => {
    const user = userEvent.setup();
    render(<CustomList />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("blocks a form until a country is chosen", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Choose a country")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
