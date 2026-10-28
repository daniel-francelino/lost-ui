import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { ChatAttachment } from "./chat-attachment";
import * as stories from "./chat-attachment.stories";

const { Playground, Removable, Thumbnail, ThumbnailOfAFile, LongName } = composeStories(stories);

describe("ChatAttachment", () => {
  it("is a chip with the name of the file", () => {
    const { container } = render(<Playground />);
    expect(screen.getByText("brief.pdf")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='chat-attachment']")).toHaveAttribute(
      "data-variant",
      "chip",
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("can be removed, with a name for screen readers", async () => {
    const user = userEvent.setup();
    render(<Removable />);
    await user.click(screen.getByRole("button", { name: "Remove brief.pdf" }));
    expect(Removable.args.onRemove).toHaveBeenCalledOnce();
  });

  it("shows an image as a picture", () => {
    render(<Thumbnail />);
    expect(screen.getByRole("img", { name: "mockup.png" })).toHaveAttribute(
      "src",
      expect.stringContaining("data:image/svg+xml"),
    );
  });

  it("shows a file that is not an image as an icon", () => {
    const { container } = render(<ThumbnailOfAFile />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("svg.lucide-file")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Remove brief.pdf" })).toBeInTheDocument();
  });

  it("cuts a long name instead of growing", () => {
    render(<LongName />);
    expect(screen.getByText(/campaign-launch-brief/)).toHaveClass("truncate");
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <ChatAttachment name="a.pdf" onRemove={() => {}} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Remover a.pdf" })).toBeInTheDocument();
  });
});
