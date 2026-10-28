import { describe, expect, it } from "vitest";

import { isToolPart, isToolRunning, messageText, toolNameOf } from "./parts";
import type { ChatToolPart } from "./types";

const tool = (patch: Partial<ChatToolPart> = {}): ChatToolPart => ({
  type: "tool-search",
  state: "output-available",
  ...patch,
});

describe("chat parts", () => {
  it("tells a tool part from the others", () => {
    expect(isToolPart(tool())).toBe(true);
    expect(isToolPart({ type: "dynamic-tool", state: "input-available" })).toBe(true);
    expect(isToolPart({ type: "text", text: "hi" })).toBe(false);
    expect(isToolPart({ type: "reasoning", text: "hm" })).toBe(false);
  });

  it("names a tool from its type, or from toolName", () => {
    expect(toolNameOf(tool())).toBe("search");
    expect(toolNameOf(tool({ toolName: "lookup" }))).toBe("lookup");
    expect(toolNameOf({ type: "dynamic-tool", state: "input-available" })).toBe("tool");
  });

  it("joins the text parts of a message and leaves the rest out", () => {
    expect(
      messageText({
        parts: [
          { type: "reasoning", text: "thinking" },
          { type: "text", text: "First." },
          tool(),
          { type: "text", text: "Second." },
        ],
      }),
    ).toBe("First.\n\nSecond.");
  });

  it("says when a tool is still running", () => {
    expect(isToolRunning(tool({ state: "input-streaming" }))).toBe(true);
    expect(isToolRunning(tool({ state: "input-available" }))).toBe(true);
    expect(isToolRunning(tool({ state: "output-available" }))).toBe(false);
    expect(isToolRunning(tool({ state: "output-error" }))).toBe(false);
  });
});
