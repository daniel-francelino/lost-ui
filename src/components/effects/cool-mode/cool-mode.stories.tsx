import type { Meta, StoryObj } from "@storybook/react-vite";
import CoolModeCustomExample from "./examples/cool-mode-custom";
import coolModeCustomExampleSource from "./examples/cool-mode-custom.tsx?raw";
import CoolModeDemoExample from "./examples/cool-mode-demo";
import coolModeDemoExampleSource from "./examples/cool-mode-demo.tsx?raw";

import { CoolMode } from "./cool-mode";

const meta = {
  title: "Effects/Interactive/CoolMode",
  component: CoolMode,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof CoolMode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: (
      <button type="button" className="rounded-lg border px-4 py-2">
        Click me
      </button>
    ),
  },
};

export const Custom: StoryObj = {
  render: () => <CoolModeCustomExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: coolModeCustomExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <CoolModeDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: coolModeDemoExampleSource, language: "tsx" } },
  },
};
