# AI chat components

> **Status: implemented and tested (2026-10-28).** Ten components and the `chat-parts` types and helpers in `src/components/ai-chat/`, public path `@danielsoaresf/lost-ui/ai-chat` (or one by path, `@danielsoaresf/lost-ui/ai-chat/chat-prompt`). Not exported from the root entry. Related: [structure.md](structure.md), [i18n.md](i18n.md).

The pieces of a chat with an assistant. They take no SDK: the messages have the shape of the Vercel AI SDK `UIMessage`, so `useChat().messages` goes in as it is, and any other source can be mapped to it.

## Where it comes from

Based on the chat components of [Nuxt UI](https://ui.nuxt.com/docs/components/chat-messages) (`ChatMessages`, `ChatMessage`, `ChatPrompt`, `ChatPromptSubmit`, `ChatReasoning`, `ChatTool`, `ChatShimmer`, `ChatPalette`), with ideas from [AI Elements](https://elements.ai-sdk.dev) (suggestions, attachments, sources) and [prompt-kit](https://www.prompt-kit.com) (stick-to-bottom scroll with a button, prompt input).

| Component          | What it is                                                                                                                                | Nuxt UI equivalent  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `ChatMessages`     | the list: scroll that follows the answer, button to the latest message, indicator, empty state, footer for the prompt                     | `UChatMessages`     |
| `ChatMessage`      | one message: bubble (`solid` `soft` `outline` `subtle` `naked`), side, avatar, hover actions, parts (text, reasoning, tool, file, source) | `UChatMessage`      |
| `ChatPrompt`       | the box: textarea that grows, send on Enter, Esc, files (button, paste, drop), header and footer slots                                    | `UChatPrompt`       |
| `ChatPromptSubmit` | the button: send when ready, stop while the answer comes, try again after an error                                                        | `UChatPromptSubmit` |
| `ChatReasoning`    | "thinking" in a block that opens while it streams and closes after, with the time it took                                                 | `UChatReasoning`    |
| `ChatTool`         | a tool call: state in one line (running, failed, done), output when opened, actions for approvals                                         | `UChatTool`         |
| `ChatShimmer`      | text with a light sweeping across it, for what is still going on                                                                          | `UChatShimmer`      |
| `ChatPalette`      | the layout for a chat inside a modal, drawer or palette: scroll above, prompt pinned below                                                | `UChatPalette`      |
| `ChatSuggestions`  | prompts to start or follow up with, as a row or a grid                                                                                    | (AI Elements)       |
| `ChatAttachment`   | a file chip or thumbnail, with remove                                                                                                     | `UChatAttachment`   |

## The message format

```ts
type ChatMessageData = { id: string; role: "system" | "user" | "assistant"; parts: ChatPart[] };

type ChatPart =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string; state?: "streaming" | "done" }
  | {
      type: `tool-${string}` | "dynamic-tool";
      toolName?;
      title?;
      state;
      input?;
      output?;
      errorText?;
    }
  | { type: "file"; mediaType: string; url: string; filename? }
  | { type: "source-url"; url: string; title? };
```

`state` of a tool is `input-streaming`, `input-available`, `output-available` or `output-error`. `title` is the short label to show ("Searching the web") instead of the tool name. A part of another type is ignored.

`status` is `ready`, `submitted`, `streaming` or `error`, the same as `useChat().status`.

## Use

```tsx
import { ChatMessages, ChatPrompt, ChatSuggestions } from "@danielsoaresf/lost-ui/ai-chat";

const { messages, status, sendMessage, stop, regenerate } = useChat();

<div className="flex h-dvh flex-col">
  <ChatMessages
    messages={messages}
    status={status}
    empty={
      <ChatSuggestions suggestions={["Plan a launch"]} onSelect={(text) => sendMessage({ text })} />
    }
    getActions={(message) =>
      message.role === "assistant"
        ? [{ label: "Copy", icon: <CopyIcon />, onClick: () => copy(messageText(message)) }]
        : undefined
    }
    renderText={(text) => <Markdown>{text}</Markdown>}
    footer={
      <ChatPrompt
        status={status}
        onSubmit={(text) => sendMessage({ text })}
        onStop={stop}
        onReload={regenerate}
      />
    }
  />
</div>;
```

- **Markdown**: the library draws text as plain text with line breaks. Pass `renderText` to use the Markdown renderer of the app.
- **Custom parts**: `renderPart(part, context)` draws a part its own way; return `undefined` to keep the default.
- **Tool approvals**: `ChatTool` takes `actions` (buttons under the label). Draw approval parts with `renderPart`.
- **Helpers and types**: `messageText(message)` (all the text of a message, e.g. to copy it), `isToolPart`, `toolNameOf`, `isToolRunning` and the types (`ChatMessageData`, `ChatPart`, `ChatStatus`, `ChatAction`…) come from the same entry, `chat-parts`.

## Behaviour worth knowing

- **Scroll**: the list goes to the bottom when it opens and follows the answer while the user is within 48 px of the bottom. If the user scrolls up to read, it stops following and a button appears to go back. A message the user sends always brings the list down.
- **Accessibility**: the list is `role="log"` with `aria-live="polite"` and `aria-busy` while the answer comes; each message is an `article` that says, for screen readers, who spoke. The prompt textarea is labelled; the buttons have names (send, stop, try again, attach, remove).
- **Reduced motion**: the shimmer is static muted text. Other motion comes from `motion` and follows `MotionConfig reducedMotion="user"`.
- **Texts**: placeholder, button names and labels come from `src/i18n` (en, es, pt).
- **Server rendering**: nothing is hidden before hydration; the entrance of content is a rise, never `opacity: 0`.
- **Prompt**: `Enter` sends, `Shift+Enter` breaks the line; with `submitOnEnter={false}`, `Ctrl/Cmd+Enter` sends. A second send is ignored while `submitted` or `streaming`. Text is trimmed; an empty text without files is not sent.

## Not done yet

- Queue of prompts while the answer streams (Nuxt UI marks it "soon").
- Edit and branch a message, feedback bar, voice input, inline citations, model picker.
- A page template (`templates/ai-chat`) with a conversation list and the chat; add it with the first app that needs it.
- Checked in jsdom only; layout, scroll and the shimmer were not looked at in a real browser.
