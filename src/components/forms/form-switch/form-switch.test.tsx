import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-switch.stories";

const { Playground, On, MustBeOn, Disabled } = composeStories(stories);

describe("FormSwitch", () => {
  it("renders the label and the description beside the switch", () => {
    render(<Playground />);
    expect(screen.getByRole("switch", { name: /Airplane mode/ })).toBeInTheDocument();
    expect(screen.getByText("Turns off all wireless connections.")).toBeInTheDocument();
  });

  it("toggles and reports the new value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);
    const toggle = screen.getByRole("switch");

    expect(toggle).not.toBeChecked();
    await user.click(toggle);

    expect(toggle).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  it("starts on with a default value", () => {
    render(<On />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("can be toggled from its label", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByText("Airplane mode"));

    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("blocks a form while it is off and the rule demands it on", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <MustBeOn />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Two factor is mandatory")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });
});
