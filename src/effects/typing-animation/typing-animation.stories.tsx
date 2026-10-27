import type { Meta, StoryObj } from "@storybook/react-vite";
import TypingAnimationDemoExample from "./examples/typing-animation-demo";
import typingAnimationDemoExampleSource from "./examples/typing-animation-demo.tsx?raw";
import TypingAnimationDemo2Example from "./examples/typing-animation-demo-2";
import typingAnimationDemo2ExampleSource from "./examples/typing-animation-demo-2.tsx?raw";
import TypingAnimationDemo3Example from "./examples/typing-animation-demo-3";
import typingAnimationDemo3ExampleSource from "./examples/typing-animation-demo-3.tsx?raw";
import TypingAnimationDemo4Example from "./examples/typing-animation-demo-4";
import typingAnimationDemo4ExampleSource from "./examples/typing-animation-demo-4.tsx?raw";
import TypingAnimationDemo5Example from "./examples/typing-animation-demo-5";
import typingAnimationDemo5ExampleSource from "./examples/typing-animation-demo-5.tsx?raw";
import TypingAnimationDemo6Example from "./examples/typing-animation-demo-6";
import typingAnimationDemo6ExampleSource from "./examples/typing-animation-demo-6.tsx?raw";
import TypingAnimationDemo7Example from "./examples/typing-animation-demo-7";
import typingAnimationDemo7ExampleSource from "./examples/typing-animation-demo-7.tsx?raw";
import TypingAnimationDemo8Example from "./examples/typing-animation-demo-8";
import typingAnimationDemo8ExampleSource from "./examples/typing-animation-demo-8.tsx?raw";

import { TypingAnimation } from "./typing-animation";

const meta = {
  title: "Effects/Text/TypingAnimation",
  component: TypingAnimation,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TypingAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Typing animation in lost-ui", className: "text-2xl font-semibold" },
};

export const RotatingWords: Story = {
  args: { words: ["Design", "Build", "Ship"], loop: true, className: "text-2xl font-semibold" },
};

export const Default: StoryObj = {
  render: () => <TypingAnimationDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <TypingAnimationDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <TypingAnimationDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemo3ExampleSource, language: "tsx" } },
  },
};

export const Example4: StoryObj = {
  render: () => <TypingAnimationDemo4Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemo4ExampleSource, language: "tsx" } },
  },
};

export const Example5: StoryObj = {
  render: () => <TypingAnimationDemo5Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemo5ExampleSource, language: "tsx" } },
  },
};

export const Example6: StoryObj = {
  render: () => <TypingAnimationDemo6Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemo6ExampleSource, language: "tsx" } },
  },
};

export const Example7: StoryObj = {
  render: () => <TypingAnimationDemo7Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemo7ExampleSource, language: "tsx" } },
  },
};

export const Example8: StoryObj = {
  render: () => <TypingAnimationDemo8Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: typingAnimationDemo8ExampleSource, language: "tsx" } },
  },
};
