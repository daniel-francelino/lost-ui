import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Theme } from "./theme";

const meta = {
  title: "App/Theme",
  component: Theme,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    children: (
      <div className="flex items-center gap-3 rounded-lg border bg-background p-4 text-foreground">
        <Button>Primary</Button>
        <Badge>Badge</Badge>
      </div>
    ),
  },
} satisfies Meta<typeof Theme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colours: Story = {
  args: { tokens: { primary: "oklch(0.55 0.25 295)", "primary-foreground": "white" } },
};

export const Radius: Story = { args: { radius: "1.5rem" } };

export const Dark: Story = { args: { dark: true } };

export const Nested: Story = {
  render: () => (
    <Theme tokens={{ primary: "oklch(0.6 0.2 150)" }}>
      <div className="grid gap-3">
        <Button>Green</Button>
        <Theme tokens={{ primary: "oklch(0.6 0.25 25)" }} radius="0">
          <Button>Red, square</Button>
        </Theme>
      </div>
    </Theme>
  ),
};

export const AsSection: Story = { args: { as: "section", className: "block" } };
