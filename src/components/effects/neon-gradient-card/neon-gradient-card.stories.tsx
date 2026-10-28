import type { Meta, StoryObj } from "@storybook/react-vite";
import NeonGradientCardDemoExample from "./examples/neon-gradient-card-demo";
import neonGradientCardDemoExampleSource from "./examples/neon-gradient-card-demo.tsx?raw";

import { NeonGradientCard } from "./neon-gradient-card";

const meta = {
  title: "Effects/Cards/NeonGradientCard",
  component: NeonGradientCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NeonGradientCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: <p className="text-2xl font-bold">Neon card</p>, className: "w-72" },
};

export const Default: StoryObj = {
  render: () => <NeonGradientCardDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: neonGradientCardDemoExampleSource, language: "tsx" } },
  },
};
