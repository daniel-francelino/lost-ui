import type { MouseEvent, ReactNode } from "react";

/** Where a chat request is: waiting, receiving, finished or failed. Same values as the Vercel AI SDK `useChat`. */
export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

export type ChatRole = "system" | "user" | "assistant";

export type ChatTextPart = { type: "text"; text: string };

export type ChatReasoningPart = {
  type: "reasoning";
  text: string;
  /** `streaming` while the text still arrives. Without it, the last part of the message streaming is taken as streaming. */
  state?: "streaming" | "done";
};

/** A tool call: `tool-<name>` (static tools) or `dynamic-tool`, as the Vercel AI SDK sends it. */
export type ChatToolPart = {
  type: `tool-${string}` | "dynamic-tool";
  toolName?: string;
  /** A short label to show instead of the tool name, e.g. "Searching the web". */
  title?: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export type ChatFilePart = {
  type: "file";
  mediaType: string;
  url: string;
  filename?: string;
};

export type ChatSourcePart = { type: "source-url"; url: string; title?: string };

export type ChatPart =
  ChatTextPart | ChatReasoningPart | ChatToolPart | ChatFilePart | ChatSourcePart;

/** A message, in the shape of the Vercel AI SDK `UIMessage`, so `useChat().messages` goes in as it is. */
export type ChatMessageData = {
  id: string;
  role: ChatRole;
  parts: ChatPart[];
};

/** A button under a message, shown on hover or focus: copy, regenerate, rate… */
export type ChatAction = {
  label: string;
  icon: ReactNode;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

/** What a custom part renderer gets, besides the part. */
export type ChatPartContext = {
  role: ChatRole;
  /** The part is the one being written right now. */
  streaming: boolean;
  index: number;
};
