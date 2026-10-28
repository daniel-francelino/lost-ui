import { composeStories } from "@storybook/react-vite";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { FormInput } from "../form-input";
import { Form, type FormHandle } from "./form";
import * as stories from "./form.stories";

const { Playground, Greedy, NoErrorFocus, Autofocus } = composeStories(stories);

const required = (message: string) => (value: string) => Boolean(value) || message;

describe("Form", () => {
  it("renders a native form with its fields", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("form[data-slot='form']")).not.toBeNull();
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("does not submit while a field is invalid and shows the message", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Playground onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits once every field passes", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Playground onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox", { name: /Email/ }), "me@lost.ui");
    await user.type(screen.getByRole("textbox", { name: /Name/ }), "Ada");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("focuses the first invalid field after a failed submit", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText("Email is required");

    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveFocus();
  });

  it("keeps the focus where it is with noErrorFocus", async () => {
    const user = userEvent.setup();
    render(<NoErrorFocus />);

    const submit = screen.getByRole("button", { name: "Submit" });
    await user.click(submit);
    await screen.findByText("Email is required");

    expect(screen.getByRole("textbox", { name: /Email/ })).not.toHaveFocus();
  });

  it("focuses the first field on mount with autofocus", () => {
    render(<Autofocus />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveFocus();
  });

  it("validates only up to the first failing field by default", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <FormInput label="First" rules={[required("First is required")]} />
        <FormInput label="Second" rules={[required("Second is required")]} />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("First is required")).toBeInTheDocument();
    expect(screen.queryByText("Second is required")).toBeNull();
  });

  it("validates every field with greedy", async () => {
    const user = userEvent.setup();
    render(<Greedy />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("At least 3 characters")).toBeInTheDocument();
  });

  it("clears the errors and calls onReset when the form is reset", async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<Playground onReset={onReset} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText("Email is required");
    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(onReset).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText("Email is required")).toBeNull());
  });

  it("reports which field failed through onValidationError", async () => {
    const onValidationError = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onValidationError={onValidationError}>
        <FormInput name="username" label="Username" rules={[required("Required")]} />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => expect(onValidationError).toHaveBeenCalledTimes(1));
    expect(onValidationError.mock.calls[0]?.[0]).toMatchObject({ name: "username" });
  });

  it("reports success through onValidationSuccess", async () => {
    const onValidationSuccess = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onValidationSuccess={onValidationSuccess}>
        <FormInput label="Username" defaultValue="ada" rules={[required("Required")]} />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => expect(onValidationSuccess).toHaveBeenCalledTimes(1));
  });

  it("exposes validate, resetValidation and the registered fields through the ref", async () => {
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
          <FormInput label="Username" rules={[required("Required")]} />
        </Form>
      );
    }

    render(<Harness />);

    expect(handle).not.toBeNull();
    expect(handle!.getValidationComponents()).toHaveLength(1);
    await expect(handle!.validate(false)).resolves.toBe(false);
    expect(await screen.findByText("Required")).toBeInTheDocument();

    handle!.resetValidation();
    await waitFor(() => expect(screen.queryByText("Required")).toBeNull());
  });

  it("waits for asynchronous rules", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <FormInput
          label="Username"
          defaultValue="taken"
          rules={[
            async (value) => {
              await Promise.resolve();
              return value !== "taken" || "Username already used";
            },
          ]}
        />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Username already used")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("unregisters a field that leaves the form", async () => {
    let handle: FormHandle | null = null;

    function Harness() {
      const [visible, setVisible] = useState(true);
      return (
        <Form
          ref={(instance) => {
            handle = instance;
          }}
        >
          {visible && <FormInput label="Temporary" rules={[required("Required")]} />}
          <button type="button" onClick={() => setVisible(false)}>
            Remove
          </button>
        </Form>
      );
    }

    const user = userEvent.setup();
    render(<Harness />);
    expect(handle!.getValidationComponents()).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(handle!.getValidationComponents()).toHaveLength(0);
    await expect(handle!.validate()).resolves.toBe(true);
  });
});
