import type { Meta, StoryObj } from "@storybook/react-vite";
import DockDemoExample from "./examples/dock-demo";
import dockDemoExampleSource from "./examples/dock-demo.tsx?raw";
import DockDemo2Example from "./examples/dock-demo-2";
import dockDemo2ExampleSource from "./examples/dock-demo-2.tsx?raw";
import DockDemo3Example from "./examples/dock-demo-3";
import dockDemo3ExampleSource from "./examples/dock-demo-3.tsx?raw";
import { HomeIcon, MailIcon, SearchIcon } from "lucide-react";

import { Dock, DockIcon } from "./dock";

const meta = {
  title: "Effects/Layout/Dock",
  component: Dock,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: null },
  render: (args) => (
    <Dock {...args}>
      {[HomeIcon, SearchIcon, MailIcon].map((Icon, index) => (
        <DockIcon key={index}>
          <Icon className="size-full" />
        </DockIcon>
      ))}
    </Dock>
  ),
};

export const Default: StoryObj = {
  render: () => <DockDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dockDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <DockDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dockDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <DockDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dockDemo3ExampleSource, language: "tsx" } },
  },
};
