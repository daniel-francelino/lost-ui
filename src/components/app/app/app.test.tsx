import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { lostI18n } from "../../../i18n";
import { toast } from "../../ui/sonner";
import { Modal } from "../../elements/modal";
import { App } from "./app";
import * as stories from "./app.stories";

const { Playground, RightToLeft, Dark, WithoutToaster, ToasterOptions } = composeStories(stories);

afterEach(async () => {
  toast.dismiss();
  await lostI18n.changeLanguage("en");
});

describe("App", () => {
  it("renders what is inside it", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
  });

  it("lets a tooltip work without a provider of its own", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Tip without its own provider");
  });

  it("shows a toast from anywhere below it", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("leaves the toaster out with toaster null", async () => {
    const user = userEvent.setup();
    render(<WithoutToaster />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("passes options to the toaster", async () => {
    const user = userEvent.setup();
    render(<ToasterOptions />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Saved");
    expect(document.querySelector("[data-sonner-toaster]")).toHaveAttribute(
      "data-y-position",
      "top",
    );
  });

  it("sets the language of the components below it", () => {
    render(
      <App language="pt" toaster={null}>
        <Modal defaultOpen title="Título" />
      </App>,
    );
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("keeps the language it already has without a language", () => {
    render(
      <App toaster={null}>
        <Modal defaultOpen title="Title" />
      </App>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("sets the reading direction", () => {
    const { container } = render(<RightToLeft />);
    expect(container.querySelector('[data-slot="app"]')).toHaveAttribute("dir", "rtl");
  });

  it("uses the dark values with dark", () => {
    const { container } = render(<Dark />);
    expect(container.querySelector('[data-slot="app"]')).toHaveClass("dark");
  });

  it("has no box of its own", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector('[data-slot="app"]')).toHaveClass("contents");
  });
});
