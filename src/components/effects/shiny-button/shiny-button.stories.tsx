import type { Meta, StoryObj } from "@storybook/react-vite";
import ShinyButtonDemoExample from "./examples/shiny-button-demo";
import shinyButtonDemoExampleSource from "./examples/shiny-button-demo.tsx?raw";

import { ShinyButton } from "./shiny-button";

const meta = {
  title: "Effects/Buttons/ShinyButton",
  component: ShinyButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShinyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Shiny button" },
};

export const Default: StoryObj = {
  render: () => <ShinyButtonDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: shinyButtonDemoExampleSource, language: "tsx" } },
  },
};
