import type { Meta, StoryObj } from "@storybook/react-vite";
import IphoneDemoExample from "./examples/iphone-demo";
import iphoneDemoExampleSource from "./examples/iphone-demo.tsx?raw";
import IphoneDemo2Example from "./examples/iphone-demo-2";
import iphoneDemo2ExampleSource from "./examples/iphone-demo-2.tsx?raw";
import IphoneDemo3Example from "./examples/iphone-demo-3";
import iphoneDemo3ExampleSource from "./examples/iphone-demo-3.tsx?raw";
import { placeholderImage } from "../../../stories/placeholder";

import { Iphone } from "./iphone";

const meta = {
  title: "Effects/Devices/Iphone",
  component: Iphone,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Iphone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { src: placeholderImage(433, 882, "iPhone") },
  render: (args) => (
    <div className="w-56">
      <Iphone {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <IphoneDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: iphoneDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <IphoneDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: iphoneDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <IphoneDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: iphoneDemo3ExampleSource, language: "tsx" } },
  },
};
