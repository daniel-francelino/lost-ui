import type { Meta, StoryObj } from "@storybook/react-vite";
import TextAnimateDemoExample from "./examples/text-animate-demo";
import textAnimateDemoExampleSource from "./examples/text-animate-demo.tsx?raw";
import TextAnimateDemo2Example from "./examples/text-animate-demo-2";
import textAnimateDemo2ExampleSource from "./examples/text-animate-demo-2.tsx?raw";
import TextAnimateDemo3Example from "./examples/text-animate-demo-3";
import textAnimateDemo3ExampleSource from "./examples/text-animate-demo-3.tsx?raw";
import TextAnimateDemo4Example from "./examples/text-animate-demo-4";
import textAnimateDemo4ExampleSource from "./examples/text-animate-demo-4.tsx?raw";
import TextAnimateDemo5Example from "./examples/text-animate-demo-5";
import textAnimateDemo5ExampleSource from "./examples/text-animate-demo-5.tsx?raw";
import TextAnimateDemo6Example from "./examples/text-animate-demo-6";
import textAnimateDemo6ExampleSource from "./examples/text-animate-demo-6.tsx?raw";
import TextAnimateDemo7Example from "./examples/text-animate-demo-7";
import textAnimateDemo7ExampleSource from "./examples/text-animate-demo-7.tsx?raw";
import TextAnimateDemo8Example from "./examples/text-animate-demo-8";
import textAnimateDemo8ExampleSource from "./examples/text-animate-demo-8.tsx?raw";
import TextAnimateDemo9Example from "./examples/text-animate-demo-9";
import textAnimateDemo9ExampleSource from "./examples/text-animate-demo-9.tsx?raw";

import { TextAnimate } from "./text-animate";

const meta = {
  title: "Effects/Text/TextAnimate",
  component: TextAnimate,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TextAnimate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Animated text from lost-ui", by: "word", className: "text-3xl font-semibold" },
};

export const ByCharacter: Story = {
  args: {
    children: "Characters",
    by: "character",
    animation: "blurInUp",
    className: "text-3xl font-semibold",
  },
};

export const Default: StoryObj = {
  render: () => <TextAnimateDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <TextAnimateDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <TextAnimateDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo3ExampleSource, language: "tsx" } },
  },
};

export const Example4: StoryObj = {
  render: () => <TextAnimateDemo4Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo4ExampleSource, language: "tsx" } },
  },
};

export const Example5: StoryObj = {
  render: () => <TextAnimateDemo5Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo5ExampleSource, language: "tsx" } },
  },
};

export const Example6: StoryObj = {
  render: () => <TextAnimateDemo6Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo6ExampleSource, language: "tsx" } },
  },
};

export const Example7: StoryObj = {
  render: () => <TextAnimateDemo7Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo7ExampleSource, language: "tsx" } },
  },
};

export const Example8: StoryObj = {
  render: () => <TextAnimateDemo8Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo8ExampleSource, language: "tsx" } },
  },
};

export const Example9: StoryObj = {
  render: () => <TextAnimateDemo9Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textAnimateDemo9ExampleSource, language: "tsx" } },
  },
};
