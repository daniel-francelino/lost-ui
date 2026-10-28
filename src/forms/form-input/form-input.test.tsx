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
  Masked,
  MaskedWithoutLiterals,
  MaskedAlternatives,
  MaskedLetters,
  CustomMaskToken,
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

  describe("mask", () => {
    it("shapes what is typed and keeps the literals in the value", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Masked onValueChange={onValueChange} />);

      const input = screen.getByLabelText("Phone");
      await user.type(input, "11987654321");

      expect(input).toHaveValue("(11) 98765-4321");
      expect(onValueChange).toHaveBeenLastCalledWith("(11) 98765-4321");
    });

    it("ignores characters the mask does not accept", async () => {
      const user = userEvent.setup();
      render(<Masked />);

      const input = screen.getByLabelText("Phone");
      await user.type(input, "1a2b");

      expect(input).toHaveValue("(12");
    });

    it("does not take more characters than the mask holds", async () => {
      const user = userEvent.setup();
      render(<Masked />);

      const input = screen.getByLabelText("Phone");
      await user.type(input, "119876543219999");

      expect(input).toHaveValue("(11) 98765-4321");
    });

    it("deletes through a literal with backspace", async () => {
      const user = userEvent.setup();
      render(<Masked />);

      const input = screen.getByLabelText("Phone");
      await user.type(input, "1198");
      expect(input).toHaveValue("(11) 98");

      await user.keyboard("{Backspace}");
      expect(input).toHaveValue("(11) 9");
      await user.keyboard("{Backspace}");
      expect(input).toHaveValue("(11");
    });

    it("shapes a value that was given without the literals", () => {
      render(<Masked defaultValue="11987654321" />);
      expect(screen.getByLabelText("Phone")).toHaveValue("(11) 98765-4321");
    });

    it("keeps the caret where the user typed", async () => {
      const user = userEvent.setup();
      render(<Masked defaultValue="1198765" />);

      const input = screen.getByLabelText("Phone") as HTMLInputElement;
      await user.type(input, "9", { initialSelectionStart: 3, initialSelectionEnd: 3 });

      expect(input).toHaveValue("(19) 18765");
      expect(input.selectionStart).toBe(4);
    });

    it("keeps only the typed characters in the value with unmask", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<MaskedWithoutLiterals onValueChange={onValueChange} />);

      const input = screen.getByLabelText("Phone");
      await user.type(input, "11987");

      expect(input).toHaveValue("(11) 987");
      expect(onValueChange).toHaveBeenLastCalledWith("11987");
    });

    it("submits the unmasked value under the field name", async () => {
      const user = userEvent.setup();
      const { container } = render(<MaskedWithoutLiterals name="phone" />);

      await user.type(screen.getByLabelText("Phone"), "119");

      expect(container.querySelector('input[type="hidden"][name="phone"]')).toHaveValue("119");
      expect(screen.getByLabelText("Phone")).not.toHaveAttribute("name");
    });

    it("submits the masked text when the value keeps the literals", async () => {
      const user = userEvent.setup();
      const { container } = render(<Masked name="phone" />);

      await user.type(screen.getByLabelText("Phone"), "119");

      expect(screen.getByLabelText("Phone")).toHaveAttribute("name", "phone");
      expect(container.querySelector('input[type="hidden"]')).toBeNull();
    });

    it("switches between masks as more characters are typed", async () => {
      const user = userEvent.setup();
      render(<MaskedAlternatives />);

      const input = screen.getByLabelText("CPF or CNPJ");
      await user.type(input, "12345678901");
      expect(input).toHaveValue("123.456.789-01");

      await user.type(input, "2");
      expect(input).toHaveValue("12.345.678/9012");
    });

    it("changes the case of the letters", async () => {
      const user = userEvent.setup();
      render(<MaskedLetters />);

      const input = screen.getByLabelText("Plate");
      await user.type(input, "abc1d23");

      expect(input).toHaveValue("ABC-1D23");
    });

    it("accepts custom tokens and an escaped literal", async () => {
      const user = userEvent.setup();
      render(<CustomMaskToken />);

      const input = screen.getByLabelText("Colour");
      await user.type(input, "ff00zz9a");

      expect(input).toHaveValue("#FF009A");
    });

    it("runs the rules on the masked value", async () => {
      const user = userEvent.setup();
      render(
        <Masked
          rules={[(value: string) => value.length === 15 || "Incomplete phone"]}
          lazyRules={false}
        />,
      );

      await user.type(screen.getByLabelText("Phone"), "11");
      expect(await screen.findByText("Incomplete phone")).toBeInTheDocument();

      await user.type(screen.getByLabelText("Phone"), "987654321");
      await waitFor(() => expect(screen.queryByText("Incomplete phone")).toBeNull());
    });
  });
});
