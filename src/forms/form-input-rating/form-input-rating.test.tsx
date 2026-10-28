import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-rating.stories";

const { Playground, Preselected, TenStars, CustomIcon, Required, ReadOnly } =
  composeStories(stories);

describe("FormInputRating", () => {
  it("renders a labelled radio group with five stars", () => {
    render(<Playground />);
    expect(screen.getByRole("radiogroup", { name: "How was it?" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("sets the rating on click", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "4 of 5" }));

    expect(onValueChange).toHaveBeenLastCalledWith(4);
    expect(screen.getByRole("radio", { name: "4 of 5" })).toBeChecked();
  });

  it("clears the rating when the same star is clicked again", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "3 of 5" }));

    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("starts from the default value", () => {
    render(<Preselected />);
    expect(screen.getByRole("radio", { name: "3 of 5" })).toBeChecked();
  });

  it("moves with the arrow keys", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    screen.getByRole("radio", { name: "3 of 5" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });

  it("supports a different maximum", () => {
    render(<TenStars />);
    expect(screen.getAllByRole("radio")).toHaveLength(10);
    expect(screen.getByRole("radio", { name: "7 of 10" })).toBeChecked();
  });

  it("draws a custom icon", () => {
    const { container } = render(<CustomIcon />);
    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  it("blocks a form until a rating is given", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Please rate")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("radio", { name: "2 of 5" }));
    await user.click(screen.getByRole("button", { name: "Go" }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("cannot be changed when read only", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<ReadOnly onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "1 of 5" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
