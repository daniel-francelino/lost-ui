import type { Meta, StoryObj } from "@storybook/react-vite";
import SpinningTextDemoExample from "./examples/spinning-text-demo";
import spinningTextDemoExampleSource from "./examples/spinning-text-demo.tsx?raw";
import SpinningTextDemo2Example from "./examples/spinning-text-demo-2";
import spinningTextDemo2ExampleSource from "./examples/spinning-text-demo-2.tsx?raw";

import { SpinningText } from "./spinning-text";

const meta = {
  title: "Effects/Text/SpinningText",
  component: SpinningText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SpinningText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "spinning • text • around • ", radius: 6, duration: 10 },
  render: (args) => (
    <div className="p-16">
      <SpinningText {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <SpinningTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: spinningTextDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <SpinningTextDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: spinningTextDemo2ExampleSource, language: "tsx" } },
  },
};
