import type { ChatMessageData, ChatPart, ChatToolPart } from "./types";

export function isToolPart(part: ChatPart): part is ChatToolPart {
  return part.type === "dynamic-tool" || part.type.startsWith("tool-");
}

/** The name of the tool of a tool part: `tool-search` gives `search`. */
export function toolNameOf(part: ChatToolPart): string {
  if (part.toolName) return part.toolName;
  return part.type === "dynamic-tool" ? "tool" : part.type.slice("tool-".length);
}

/** All the text of a message, e.g. to copy it. Reasoning and tools are left out. */
export function messageText(message: Pick<ChatMessageData, "parts">): string {
  return message.parts
    .flatMap((part) => (part.type === "text" ? [part.text] : []))
    .join("\n\n")
    .trim();
}

/** The tool is still being written or run. */
export function isToolRunning(part: ChatToolPart): boolean {
  return part.state === "input-streaming" || part.state === "input-available";
}
