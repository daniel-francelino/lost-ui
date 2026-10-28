import type { Meta, StoryObj } from "@storybook/react-vite";
import AndroidDemoExample from "./examples/android-demo";
import androidDemoExampleSource from "./examples/android-demo.tsx?raw";
import AndroidDemo2Example from "./examples/android-demo-2";
import androidDemo2ExampleSource from "./examples/android-demo-2.tsx?raw";
import AndroidDemo3Example from "./examples/android-demo-3";
import androidDemo3ExampleSource from "./examples/android-demo-3.tsx?raw";
import { placeholderImage } from "../../../stories/placeholder";

import { Android } from "./android";

const meta = {
  title: "Effects/Devices/Android",
  component: Android,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Android>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { width: 217, height: 441, src: placeholderImage(433, 882, "Android") },
};

export const Default: StoryObj = {
  render: () => <AndroidDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: androidDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <AndroidDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: androidDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <AndroidDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: androidDemo3ExampleSource, language: "tsx" } },
  },
};
