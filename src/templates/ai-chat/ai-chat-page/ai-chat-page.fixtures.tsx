import type { ChatMessageData } from "../../../components/ai-chat";
import type { AiChatConversation } from "./ai-chat-page";

export const conversations: AiChatConversation[] = [
  { id: "c1", title: "Launch campaign for the bakery", group: "Today" },
  { id: "c2", title: "Captions for Instagram", group: "Today" },
  { id: "c3", title: "Monthly results summary", group: "Last week" },
  { id: "c4", group: "Last week" },
];

export const messages: ChatMessageData[] = [
  {
    id: "m1",
    role: "user",
    parts: [{ type: "text", text: "Plan a launch campaign for our bakery." }],
  },
  {
    id: "m2",
    role: "assistant",
    parts: [
      {
        type: "reasoning",
        text: "Local audience, visual product: Instagram first.",
        state: "done",
      },
      {
        type: "tool-search",
        title: "Searched the web",
        state: "output-available",
        output: { results: 3 },
      },
      {
        type: "text",
        text: "Here is a plan for the launch week:\n\n1. Teaser posts on Instagram\n2. A giveaway in stories\n3. A newsletter to the mailing list",
      },
    ],
  },
];

export const suggestions = [
  "Plan a launch campaign",
  "Write three captions for Instagram",
  "Summarise last month's results",
  "Give me content ideas for this week",
];
