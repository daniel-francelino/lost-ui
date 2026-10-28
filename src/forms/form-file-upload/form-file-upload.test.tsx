import { composeStories } from "@storybook/react-vite";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-file-upload.stories";

const { Playground, Multiple, LimitedSize, CustomText, Required, Disabled } =
  composeStories(stories);

const png = (name = "avatar.png", size = 10) =>
  new File([new Uint8Array(size)], name, { type: "image/png" });

describe("FormFileUpload", () => {
  it("renders a labelled dropzone with the default text", () => {
    render(<Playground />);
    expect(screen.getByLabelText(/Avatar/)).toHaveAttribute("type", "file");
    expect(screen.getByText("Drop files here or click to browse")).toBeInTheDocument();
  });

  it("accepts a custom dropzone text", () => {
    render(<CustomText />);
    expect(screen.getByText("Drag your resume here")).toBeInTheDocument();
  });

  it("lists the chosen file and reports it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.upload(screen.getByLabelText(/Avatar/), png());

    expect(screen.getByText("avatar.png")).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith([expect.any(File)]);
  });

  it("shows the file size", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.upload(screen.getByLabelText(/Avatar/), png("big.png", 2048));

    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
  });

  it("replaces the file when only one is allowed", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.upload(screen.getByLabelText(/Avatar/), png("one.png"));
    await user.upload(screen.getByLabelText(/Avatar/), png("two.png"));

    expect(screen.queryByText("one.png")).toBeNull();
    expect(screen.getByText("two.png")).toBeInTheDocument();
  });

  it("keeps adding files when multiple is on", async () => {
    const user = userEvent.setup();
    render(<Multiple />);

    await user.upload(screen.getByLabelText(/Attachments/), [png("a.png"), png("b.png")]);
    await user.upload(screen.getByLabelText(/Attachments/), png("c.png"));

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("removes a file with its button", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Multiple onValueChange={onValueChange} />);

    await user.upload(screen.getByLabelText(/Attachments/), [png("a.png"), png("b.png")]);
    await user.click(screen.getByRole("button", { name: "Remove a.png" }));

    expect(screen.queryByText("a.png")).toBeNull();
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "b.png" })]);
  });

  it("rejects a file of the wrong type", () => {
    const onReject = vi.fn();
    const onValueChange = vi.fn();
    render(<LimitedSize onReject={onReject} onValueChange={onValueChange} />);

    fireEvent.change(screen.getByLabelText(/Document/), {
      target: { files: [new File(["x"], "photo.png", { type: "image/png" })] },
    });

    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ name: "photo.png" })], "type");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("rejects a file that is too large", () => {
    const onReject = vi.fn();
    render(<LimitedSize onReject={onReject} />);

    fireEvent.change(screen.getByLabelText(/Document/), {
      target: {
        files: [
          new File([new Uint8Array(2 * 1024 * 1024)], "big.pdf", { type: "application/pdf" }),
        ],
      },
    });

    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ name: "big.pdf" })], "size");
  });

  it("accepts files dropped on the zone", () => {
    const onValueChange = vi.fn();
    render(<Playground onValueChange={onValueChange} />);

    fireEvent.drop(screen.getByText("Drop files here or click to browse"), {
      dataTransfer: { files: [png("dropped.png")] },
    });

    expect(screen.getByText("dropped.png")).toBeInTheDocument();
  });

  it("highlights the zone while a file is dragged over it", () => {
    render(<Playground />);
    const zone = screen
      .getByText("Drop files here or click to browse")
      .closest("label") as HTMLElement;

    fireEvent.dragOver(zone);
    expect(zone).toHaveAttribute("data-dragging");
    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveAttribute("data-dragging");
  });

  it("blocks a form until a file is chosen", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Upload a file")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByLabelText(/Avatar/)).toBeDisabled();
  });
});
