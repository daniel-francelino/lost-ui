import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Stepper, type StepperHandle } from "./stepper";
import * as stories from "./stepper.stories";

const {
  Playground,
  DefaultValue,
  Vertical,
  NotLinear,
  Colors,
  Sizes,
  DisabledStep,
  WithControls,
  CustomContent,
} = composeStories(stories);

const step = (name: RegExp) => screen.getByRole("button", { name });
const state = (name: RegExp) => step(name).closest("li")?.getAttribute("data-state");

describe("Stepper", () => {
  it("lists the steps with their title and description", () => {
    render(<Playground />);
    expect(screen.getByRole("list", { name: "Checkout" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Where to send it")).toBeInTheDocument();
  });

  it("starts on the first step and shows its content", () => {
    render(<Playground />);
    expect(step(/Address/)).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Fill in the delivery address.")).toBeInTheDocument();
    expect(screen.queryByText("Choose a payment method.")).toBeNull();
  });

  it("marks the steps as completed, active and upcoming", () => {
    render(<DefaultValue />);
    expect(state(/Address/)).toBe("completed");
    expect(state(/Payment/)).toBe("active");
    expect(state(/Review/)).toBe("upcoming");
  });

  it("shows a check in a completed step and the number in the others", () => {
    const { container } = render(<DefaultValue defaultValue={2} />);
    const indicators = container.querySelectorAll('[data-slot="stepper-indicator"]');
    expect(indicators[0]?.querySelector("svg")).not.toBeNull();
    expect(indicators[1]?.querySelector("svg")).not.toBeNull();
    expect(indicators[2]?.querySelector("svg")).not.toBeNull();
  });

  it("shows the number of a step with no icon", () => {
    render(<Stepper items={[{ title: "One" }, { title: "Two" }]} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("goes to the next step with a click and reports the value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(step(/Payment/));

    expect(step(/Payment/)).toHaveAttribute("aria-current", "step");
    expect(onValueChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("Choose a payment method.")).toBeInTheDocument();
  });

  it("does not let a linear stepper jump over a step", () => {
    render(<Playground />);
    expect(step(/Review/)).toBeDisabled();
    expect(step(/Payment/)).toBeEnabled();
  });

  it("lets it go back to a completed step", async () => {
    const user = userEvent.setup();
    render(<DefaultValue defaultValue={2} />);

    await user.click(step(/Address/));

    expect(step(/Address/)).toHaveAttribute("aria-current", "step");
  });

  it("lets a stepper that is not linear jump to any step", async () => {
    const user = userEvent.setup();
    render(<NotLinear />);

    await user.click(step(/Review/));

    expect(step(/Review/)).toHaveAttribute("aria-current", "step");
  });

  it("blocks a disabled step", () => {
    render(<DisabledStep />);
    expect(step(/Review/)).toBeDisabled();
  });

  it("matches the active step by its value", () => {
    render(
      <Stepper
        defaultValue="b"
        items={[
          { value: "a", title: "A" },
          { value: "b", title: "B" },
        ]}
      />,
    );
    expect(step(/B/)).toHaveAttribute("aria-current", "step");
  });

  it("can be controlled", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Playground value={0} />);

    await user.click(step(/Payment/));
    expect(step(/Address/)).toHaveAttribute("aria-current", "step");

    rerender(<Playground value={2} />);
    expect(step(/Review/)).toHaveAttribute("aria-current", "step");
  });

  it("moves with the handle and tells which way it can go", () => {
    const ref = createRef<StepperHandle>();
    const onNext = vi.fn();
    const onPrev = vi.fn();
    render(<Playground ref={ref} onNext={onNext} onPrev={onPrev} />);

    expect(ref.current?.hasPrev()).toBe(false);
    expect(ref.current?.hasNext()).toBe(true);

    ref.current?.next();
    expect(onNext.mock.calls[0]?.[0]).toMatchObject({ title: "Payment" });

    ref.current?.prev();
    expect(onPrev.mock.calls[0]?.[0]).toMatchObject({ title: "Address" });
  });

  it("stops at the ends with the handle", async () => {
    const user = userEvent.setup();
    render(<WithControls />);

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(step(/Address/)).toHaveAttribute("aria-current", "step");

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(step(/Review/)).toHaveAttribute("aria-current", "step");
  });

  it("blocks the clicks on the steps with disabled", () => {
    render(<WithControls />);
    expect(step(/Address/)).toBeDisabled();
    expect(step(/Payment/)).toBeDisabled();
  });

  it("lays out vertically", () => {
    render(<Vertical />);
    expect(screen.getByRole("list")).toHaveClass("flex-col");
  });

  it("colours the reached steps", () => {
    const { container } = render(<Colors />);
    const indicators = [...container.querySelectorAll('[data-slot="stepper-indicator"]')];
    expect(indicators[0]).toHaveClass("bg-primary");
    expect(indicators[3]).toHaveClass("bg-success");
    expect(indicators[2]).toHaveClass("border-border");
  });

  it("applies each size", () => {
    const { container } = render(<Sizes />);
    const indicators = [...container.querySelectorAll('[data-slot="stepper-indicator"]')];
    expect(indicators[0]).toHaveClass("size-5");
    expect(indicators[12]).toHaveClass("size-12");
  });

  it("lets the app draw the panel of the active step", () => {
    render(<CustomContent />);
    expect(screen.getByText("Panel of Address")).toBeInTheDocument();
  });

  it("draws no panel when the step has no content", () => {
    const { container } = render(<Stepper items={[{ title: "A" }]} />);
    expect(container.querySelector('[data-slot="stepper-content"]')).toBeNull();
  });
});
