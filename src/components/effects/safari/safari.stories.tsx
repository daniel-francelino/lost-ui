import type { Meta, StoryObj } from "@storybook/react-vite";
import SafariDemoExample from "./examples/safari-demo";
import safariDemoExampleSource from "./examples/safari-demo.tsx?raw";
import SafariDemo2Example from "./examples/safari-demo-2";
import safariDemo2ExampleSource from "./examples/safari-demo-2.tsx?raw";
import SafariDemo3Example from "./examples/safari-demo-3";
import safariDemo3ExampleSource from "./examples/safari-demo-3.tsx?raw";
import SafariDemo4Example from "./examples/safari-demo-4";
import safariDemo4ExampleSource from "./examples/safari-demo-4.tsx?raw";
import { placeholderImage } from "../../../stories/placeholder";

import { Safari } from "./safari";

const meta = {
  title: "Effects/Devices/Safari",
  component: Safari,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Safari>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { url: "lost-ui.dev", imageSrc: placeholderImage(1203, 753, "Safari") },
  render: (args) => (
    <div className="w-[34rem]">
      <Safari {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <SafariDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: safariDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <SafariDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: safariDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <SafariDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: safariDemo3ExampleSource, language: "tsx" } },
  },
};

export const Example4: StoryObj = {
  render: () => <SafariDemo4Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: safariDemo4ExampleSource, language: "tsx" } },
  },
};
