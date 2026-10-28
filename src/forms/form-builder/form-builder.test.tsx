import { composeStories } from "@storybook/react-vite";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./form-builder.stories";

const { Playground, SingleColumn, WithDefaultValues, Loading, AllFieldTypes } =
  composeStories(stories);

describe("FormBuilder", () => {
  it("builds a labelled control for every visible field", () => {
    render(<Playground />);
    expect(screen.getByRole("textbox", { name: /Full name/ })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /Country/ })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Seats" })).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders every supported field type", () => {
    render(<AllFieldTypes />);
    expect(screen.getByRole("textbox", { name: "Input" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Radio group" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Checkbox group" })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: "Listbox" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeInTheDocument();
    expect(screen.getByLabelText("Pin input")).toBeInTheDocument();
    expect(screen.getByLabelText(/^File/)).toHaveAttribute("type", "file");
  });

  it("lays the fields in the requested number of columns", () => {
    const { container, unmount } = render(<Playground />);
    expect(container.querySelector("[data-slot='form-builder-fields']")).toHaveClass(
      "sm:grid-cols-2",
    );
    unmount();
    const single = render(<SingleColumn />);
    expect(single.container.querySelector("[data-slot='form-builder-fields']")).toHaveClass(
      "grid-cols-1",
    );
  });

  it("lets a field span the whole row", () => {
    render(<Playground />);
    expect(screen.getByRole("textbox", { name: "Bio" }).closest(".col-span-full")).not.toBeNull();
  });

  it("starts from the default values", () => {
    render(<WithDefaultValues />);
    expect(screen.getByRole("textbox", { name: /Full name/ })).toHaveValue("Ada Lovelace");
    expect(screen.getByRole("combobox", { name: /Country/ })).toHaveTextContent("Portugal");
    expect(screen.getByRole("spinbutton", { name: "Seats" })).toHaveValue("3");
  });

  it("reports every change with the whole values object", async () => {
    const onValuesChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValuesChange={onValuesChange} />);

    await user.type(screen.getByRole("textbox", { name: /Full name/ }), "Ada");

    expect(onValuesChange).toHaveBeenLastCalledWith(expect.objectContaining({ name: "Ada" }));
  });

  it("shows a conditional field only while its condition holds", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    expect(screen.queryByRole("textbox", { name: /Company/ })).toBeNull();
    await user.click(screen.getByRole("switch"));
    expect(await screen.findByRole("textbox", { name: /Company/ })).toBeInTheDocument();
    await user.click(screen.getByRole("switch"));
    expect(screen.queryByRole("textbox", { name: /Company/ })).toBeNull();
  });

  it("does not submit while a rule fails and shows every message with greedy", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Playground onSubmit={onSubmit} greedy />);

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Choose a country")).toBeInTheDocument();
    expect(screen.getByText("You must accept the terms")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the collected values once every rule passes", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Playground onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox", { name: /Full name/ }), "Ada Lovelace");
    await user.type(screen.getByRole("textbox", { name: /Email/ }), "ada@example.com");
    await user.click(screen.getByRole("combobox", { name: /Country/ }));
    await user.click(await screen.findByRole("option", { name: "Brazil" }));
    await user.click(screen.getByRole("checkbox", { name: /terms/ }));
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ada Lovelace",
        email: "ada@example.com",
        country: "br",
        terms: true,
      }),
    );
  });

  it("restores the default values on reset", async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<WithDefaultValues onReset={onReset} />);
    const name = screen.getByRole("textbox", { name: /Full name/ });

    await user.clear(name);
    await user.type(name, "Someone else");
    await user.click(screen.getByRole("button", { name: "Reset" }));

    await waitFor(() => expect(name).toHaveValue("Ada Lovelace"));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("can be driven from outside with the values prop", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Playground values={{ name: "From outside" }} />);
    expect(screen.getByRole("textbox", { name: /Full name/ })).toHaveValue("From outside");

    rerender(<Playground values={{ name: "Updated" }} />);
    expect(screen.getByRole("textbox", { name: /Full name/ })).toHaveValue("Updated");
    await user.type(screen.getByRole("textbox", { name: /Full name/ }), "x");
    expect(screen.getByRole("textbox", { name: /Full name/ })).toHaveValue("Updated");
  });

  it("disables the submit button while loading", () => {
    render(<Loading />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("renders extra actions next to the buttons", () => {
    render(<Playground actions={<button type="button">Save draft</button>} />);
    expect(screen.getByRole("button", { name: "Save draft" })).toBeInTheDocument();
  });
});
