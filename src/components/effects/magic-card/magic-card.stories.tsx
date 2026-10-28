import type { Meta, StoryObj } from "@storybook/react-vite";
import MagicCardDemoExample from "./examples/magic-card-demo";
import magicCardDemoExampleSource from "./examples/magic-card-demo.tsx?raw";
import MagicCardDemo2Example from "./examples/magic-card-demo2";
import magicCardDemo2ExampleSource from "./examples/magic-card-demo2.tsx?raw";

import { MagicCard } from "./magic-card";

const meta = {
  title: "Effects/Cards/MagicCard",
  component: MagicCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MagicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: <p className="p-8">Magic card</p>,
    className: "h-48 w-72 items-center justify-center",
  },
};

export const Orb: Story = {
  args: {
    mode: "orb",
    children: <p className="p-8">Orb mode</p>,
    className: "h-48 w-72 items-center justify-center",
  },
};

export const Default: StoryObj = {
  render: () => <MagicCardDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: magicCardDemoExampleSource, language: "tsx" } },
  },
};

export const Demo2: StoryObj = {
  render: () => <MagicCardDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: magicCardDemo2ExampleSource, language: "tsx" } },
  },
};
