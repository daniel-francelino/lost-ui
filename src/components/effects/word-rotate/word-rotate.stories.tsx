import type { Meta, StoryObj } from "@storybook/react-vite";
import WordRotateDemoExample from "./examples/word-rotate-demo";
import wordRotateDemoExampleSource from "./examples/word-rotate-demo.tsx?raw";

import { WordRotate } from "./word-rotate";

const meta = {
  title: "Effects/Text/WordRotate",
  component: WordRotate,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof WordRotate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { words: ["Design", "Develop", "Deploy"], className: "text-4xl font-bold" },
};

export const Default: StoryObj = {
  render: () => <WordRotateDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: wordRotateDemoExampleSource, language: "tsx" } },
  },
};
