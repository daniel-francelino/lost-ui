import { composeStories } from "@storybook/react-vite";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Form, type FormHandle } from "../form";
import { FormInput } from "./form-input";
import * as stories from "./form-input.stories";

const {
  Playground,
  WithRules,
  LazyRules,
  OnDemand,
  AsyncRule,
  WithHelpAndHint,
  WithIcons,
  Loading,
  ExternalError,
  Disabled,
  Sizes,
} = composeStories(stories);

describe("FormInput", () => {
  it("labels the input and shows the placeholder", () => {
    render(<Playground />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
    expect(input).toHaveAttribute("type", "email");
  });

  it("marks a required field", () => {
    render(<WithRules />);
    const input = screen.getByRole("textbox", { name: /Email/ });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("keeps what the user types and reports it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("Email"), "ab");

    expect(screen.getByLabelText("Email")).toHaveValue("ab");
    expect(onValueChange).toHaveBeenLastCalledWith("ab");
  });

  it("follows the value prop when it is controlled", async () => {
    function Harness() {
      const [value, setValue] = useState("start");
      return (
        <>
          <FormInput label="Name" value={value} onValueChange={setValue} />
          <button type="button" onClick={() => setValue("changed")}>
            Change
          </button>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByLabelText("Name")).toHaveValue("start");
    await user.click(screen.getByRole("button", { name: "Change" }));
    expect(screen.getByLabelText("Name")).toHaveValue("changed");
  });

  it("validates on every change by default and describes the error", async () => {
    const user = userEvent.setup();
    render(<WithRules />);
    const input = screen.getByRole("textbox", { name: /Email/ });

    await user.type(input, "nope");

    const message = await screen.findByText("Enter a valid email");
    expect(message).toHaveAttribute("role", "alert");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(message.id);
  });

  it("clears the error as soon as the value becomes valid", async () => {
    const user = userEvent.setup();
    render(<WithRules />);
    const input = screen.getByRole("textbox", { name: /Email/ });

    await user.type(input, "nope");
    await screen.findByText("Enter a valid email");
    await user.type(input, "{Backspace>4/}me@lost.ui");

    await waitFor(() => expect(screen.queryByText("Enter a valid email")).toBeNull());
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("waits for the blur with lazyRules, then revalidates while there is an error", async () => {
    const user = userEvent.setup();
    render(<LazyRules />);
    const input = screen.getByLabelText(/Email/);

    await user.type(input, "nope");
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(screen.queryByText("Enter a valid email")).toBeNull();

    await user.tab();
    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();

    await user.type(input, "@lost.ui");
    await waitFor(() => expect(screen.queryByText("Enter a valid email")).toBeNull());
  });

  it("validates only when the form asks with lazyRules ondemand", async () => {
    let handle: FormHandle | null = null;
    const user = userEvent.setup();
    const { container } = render(
      <Form
        ref={(instance) => {
          handle = instance;
        }}
      >
        <OnDemand />
      </Form>,
    );
    expect(container).toBeTruthy();

    await user.type(screen.getByLabelText(/Email/), "nope");
    await user.tab();
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(screen.queryByText("Enter a valid email")).toBeNull();

    await handle!.validate(false);
    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
  });

  it("shows the pending state of an asynchronous rule and then its message", async () => {
    const user = userEvent.setup();
    render(<AsyncRule />);

    await user.type(screen.getByLabelText("Username"), "taken");

    expect(await screen.findByText("That username is already used")).toBeInTheDocument();
  });

  it("shows the help text until there is an error", () => {
    render(<WithHelpAndHint />);
    expect(screen.getByText("We never share it.")).toBeInTheDocument();
    expect(screen.getByText("Use at least 12 characters.")).toBeInTheDocument();
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("shows an error given from outside", () => {
    render(<ExternalError />);
    expect(screen.getByText("This email is blocked")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not validate a disabled field", async () => {
    const rule = vi.fn(() => "never");
    const user = userEvent.setup();
    render(
      <Form>
        <FormInput label="Locked" disabled rules={[rule]} defaultValue="x" />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(rule).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Locked")).toBeDisabled();
  });

  it("revalidates when the rules change with reactiveRules", async () => {
    let setMinimum: (value: number) => void = () => {};

    function Harness() {
      const [minimum, update] = useState(2);
      setMinimum = update;
      return (
        <FormInput
          label="Code"
          reactiveRules
          rules={[(value: string) => value.length >= minimum || `At least ${minimum} characters`]}
        />
      );
    }
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(screen.getByLabelText("Code"), "abc");
    expect(screen.queryByText(/At least/)).toBeNull();
    act(() => setMinimum(6));

    expect(await screen.findByText("At least 6 characters")).toBeInTheDocument();
  });

  it("does not revalidate on a rules change without reactiveRules", async () => {
    let setMinimum: (value: number) => void = () => {};

    function Harness() {
      const [minimum, update] = useState(2);
      setMinimum = update;
      return (
        <FormInput
          label="Code"
          rules={[(value: string) => value.length >= minimum || `At least ${minimum} characters`]}
        />
      );
    }
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(screen.getByLabelText("Code"), "abc");
    act(() => setMinimum(6));
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(screen.queryByText(/At least/)).toBeNull();
  });

  it("renders leading and trailing content", () => {
    const { container } = render(<WithIcons />);
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
  });

  it("shows a spinner while loading", () => {
    render(<Loading />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("disables the control", () => {
    render(<Disabled />);
    expect(screen.getByLabelText("Locked")).toBeDisabled();
  });

  it("applies the size classes", () => {
    render(<Sizes />);
    expect(screen.getByLabelText("Size xs")).toHaveClass("h-7");
    expect(screen.getByLabelText("Size xl")).toHaveClass("h-12");
  });

  it("registers with the form and lets it focus the field", async () => {
    let handle: FormHandle | null = null;
    function Harness() {
      const ref = useRef<FormHandle>(null);
      return (
        <Form
          ref={(instance) => {
            handle = instance;
            ref.current = instance;
          }}
        >
          <FormInput label="Name" rules={[(value: string) => Boolean(value) || "Required"]} />
        </Form>
      );
    }
    render(<Harness />);

    await handle!.validate();

    expect(screen.getByLabelText(/Name/)).toHaveFocus();
  });
});
