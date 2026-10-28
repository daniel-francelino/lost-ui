import { composeStories } from "@storybook/react-vite";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-radio-group.stories";

const { Playground, Preselected, Horizontal, StringItems, Required, Disabled } =
  composeStories(stories);

describe("FormRadioGroup", () => {
  it("renders a labelled radio group with one radio per item", () => {
    render(<Playground />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByText("For hobby projects")).toBeInTheDocument();
  });

  it("selects the clicked option and reports it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: /Pro/ }));

    expect(screen.getByRole("radio", { name: /Pro/ })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
  });

  it("starts on the default value", () => {
    render(<Preselected />);
    expect(screen.getByRole("radio", { name: /Pro/ })).toBeChecked();
  });

  it("does not select a disabled item", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("radio", { name: /Enterprise/ }));

    expect(screen.getByRole("radio", { name: /Enterprise/ })).not.toBeChecked();
  });

  it("selects from the label text", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByText("Free"));

    expect(screen.getByRole("radio", { name: /Free/ })).toBeChecked();
  });

  it("accepts plain strings as items", () => {
    render(<StringItems />);
    expect(screen.getByRole("radio", { name: "Medium" })).toBeInTheDocument();
  });

  it("lays the options in a row when horizontal", () => {
    render(<Horizontal />);
    expect(screen.getByRole("radiogroup")).toHaveClass("grid-flow-col");
  });

  it("moves the focus with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Preselected />);

    await user.click(screen.getByRole("radio", { name: /Pro/ }));
    await user.keyboard("{ArrowUp}");

    await waitFor(() => expect(screen.getByRole("radio", { name: /Free/ })).toHaveFocus());
  });

  it("blocks a form until an option is chosen", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Choose a plan")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("radio", { name: /Free/ }));
    await user.click(screen.getByRole("button", { name: "Go" }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("disables every radio when locked", () => {
    render(<Disabled />);
    screen.getAllByRole("radio").forEach((radio) => expect(radio).toBeDisabled());
  });
});
