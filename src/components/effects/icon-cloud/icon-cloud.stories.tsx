import type { Meta, StoryObj } from "@storybook/react-vite";
import IconCloudDemoExample from "./examples/icon-cloud-demo";
import iconCloudDemoExampleSource from "./examples/icon-cloud-demo.tsx?raw";
import IconCloudDemo2Example from "./examples/icon-cloud-demo-2";
import iconCloudDemo2ExampleSource from "./examples/icon-cloud-demo-2.tsx?raw";
import IconCloudDemo3Example from "./examples/icon-cloud-demo-3";
import iconCloudDemo3ExampleSource from "./examples/icon-cloud-demo-3.tsx?raw";
import { placeholderImage } from "../../../stories/placeholder";

import { IconCloud } from "./icon-cloud";

const meta = {
  title: "Effects/Media/IconCloud",
  component: IconCloud,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof IconCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { images: [1, 2, 3, 4, 5, 6].map((id) => placeholderImage(64, 64, String(id))) },
  render: (args) => (
    <div className="size-80">
      <IconCloud {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <IconCloudDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: iconCloudDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <IconCloudDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: iconCloudDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <IconCloudDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: iconCloudDemo3ExampleSource, language: "tsx" } },
  },
};
