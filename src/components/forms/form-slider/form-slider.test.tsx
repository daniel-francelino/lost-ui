import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-slider.stories";

const { Playground, Range, Stepped, AtLeast, Disabled } = composeStories(stories);

describe("FormSlider", () => {
  it("exposes the value to assistive technology", () => {
    render(<Playground />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
  });

  it("shows the current value as a hint when asked", () => {
    render(<Playground />);
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("changes with the arrow keys and reports a number", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenLastCalledWith(41);
  });

  it("renders two thumbs and reports an array for a range", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Range onValueChange={onValueChange} />);

    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(screen.getByText("20 – 80")).toBeInTheDocument();

    thumbs[0]?.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([21, 80]);
  });

  it("moves by the step", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Stepped onValueChange={onValueChange} />);

    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenLastCalledWith(6);
  });

  it("blocks a form while the value is below the minimum rule", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <AtLeast />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Volume must be at least 10")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("slider")).toHaveAttribute("data-disabled");
  });
});
