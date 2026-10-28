import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-checkbox.stories";

const { Playground, Checked, Indeterminate, MustAccept, Disabled } = composeStories(stories);

describe("FormCheckbox", () => {
  it("renders the label and the description next to the box", () => {
    render(<Playground />);
    expect(screen.getByRole("checkbox", { name: /Subscribe/ })).toBeInTheDocument();
    expect(screen.getByText("One email a week.")).toBeInTheDocument();
  });

  it("starts unchecked and toggles on click", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);
    const box = screen.getByRole("checkbox");

    expect(box).not.toBeChecked();
    await user.click(box);

    expect(box).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(true);
    await user.click(box);
    expect(onValueChange).toHaveBeenLastCalledWith(false);
  });

  it("starts checked with a default value", () => {
    render(<Checked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles from the label", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByText("Subscribe to the newsletter"));

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("shows the mixed state", () => {
    render(<Indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
  });

  it("blocks a form until the box is checked", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <MustAccept />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("You must accept the terms")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Go" }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
