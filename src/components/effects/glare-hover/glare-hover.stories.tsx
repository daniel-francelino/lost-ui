import type { Meta, StoryObj } from "@storybook/react-vite";
import GlareHoverDemoExample from "./examples/glare-hover-demo";
import glareHoverDemoExampleSource from "./examples/glare-hover-demo.tsx?raw";
import GlareHoverDemoAlertExample from "./examples/glare-hover-demo-alert";
import glareHoverDemoAlertExampleSource from "./examples/glare-hover-demo-alert.tsx?raw";
import GlareHoverDemoCtaExample from "./examples/glare-hover-demo-cta";
import glareHoverDemoCtaExampleSource from "./examples/glare-hover-demo-cta.tsx?raw";

import { GlareHover } from "./glare-hover";

const meta = {
  title: "Effects/Cards/GlareHover",
  component: GlareHover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof GlareHover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    width: "18rem",
    height: "12rem",
    color: "#ffffff",
    background: "var(--primary)",
    children: <p className="text-sm text-primary-foreground">Hover for a glare</p>,
  },
};

export const Default: StoryObj = {
  render: () => <GlareHoverDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: glareHoverDemoExampleSource, language: "tsx" } },
  },
};

export const Alert: StoryObj = {
  render: () => <GlareHoverDemoAlertExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: glareHoverDemoAlertExampleSource, language: "tsx" } },
  },
};

export const Cta: StoryObj = {
  render: () => <GlareHoverDemoCtaExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: glareHoverDemoCtaExampleSource, language: "tsx" } },
  },
};
