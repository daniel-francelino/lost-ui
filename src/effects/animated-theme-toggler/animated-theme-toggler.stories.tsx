import type { Meta, StoryObj } from "@storybook/react-vite";
import AnimatedThemeTogglerDemoExample from "./examples/animated-theme-toggler-demo";
import animatedThemeTogglerDemoExampleSource from "./examples/animated-theme-toggler-demo.tsx?raw";
import AnimatedThemeTogglerDiamondDemoExample from "./examples/animated-theme-toggler-diamond-demo";
import animatedThemeTogglerDiamondDemoExampleSource from "./examples/animated-theme-toggler-diamond-demo.tsx?raw";
import AnimatedThemeTogglerHexagonDemoExample from "./examples/animated-theme-toggler-hexagon-demo";
import animatedThemeTogglerHexagonDemoExampleSource from "./examples/animated-theme-toggler-hexagon-demo.tsx?raw";
import AnimatedThemeTogglerNextThemesDemoExample from "./examples/animated-theme-toggler-next-themes-demo";
import animatedThemeTogglerNextThemesDemoExampleSource from "./examples/animated-theme-toggler-next-themes-demo.tsx?raw";
import AnimatedThemeTogglerRectangleDemoExample from "./examples/animated-theme-toggler-rectangle-demo";
import animatedThemeTogglerRectangleDemoExampleSource from "./examples/animated-theme-toggler-rectangle-demo.tsx?raw";
import AnimatedThemeTogglerSquareDemoExample from "./examples/animated-theme-toggler-square-demo";
import animatedThemeTogglerSquareDemoExampleSource from "./examples/animated-theme-toggler-square-demo.tsx?raw";
import AnimatedThemeTogglerStarDemoExample from "./examples/animated-theme-toggler-star-demo";
import animatedThemeTogglerStarDemoExampleSource from "./examples/animated-theme-toggler-star-demo.tsx?raw";
import AnimatedThemeTogglerTriangleDemoExample from "./examples/animated-theme-toggler-triangle-demo";
import animatedThemeTogglerTriangleDemoExampleSource from "./examples/animated-theme-toggler-triangle-demo.tsx?raw";

import { AnimatedThemeToggler } from "./animated-theme-toggler";

const meta = {
  title: "Effects/Buttons/AnimatedThemeToggler",
  component: AnimatedThemeToggler,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedThemeToggler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};

export const Default: StoryObj = {
  render: () => <AnimatedThemeTogglerDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerDemoExampleSource, language: "tsx" } },
  },
};

export const Diamond: StoryObj = {
  render: () => <AnimatedThemeTogglerDiamondDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerDiamondDemoExampleSource, language: "tsx" } },
  },
};

export const Hexagon: StoryObj = {
  render: () => <AnimatedThemeTogglerHexagonDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerHexagonDemoExampleSource, language: "tsx" } },
  },
};

export const NextThemes: StoryObj = {
  render: () => <AnimatedThemeTogglerNextThemesDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerNextThemesDemoExampleSource, language: "tsx" } },
  },
};

export const Rectangle: StoryObj = {
  render: () => <AnimatedThemeTogglerRectangleDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerRectangleDemoExampleSource, language: "tsx" } },
  },
};

export const Square: StoryObj = {
  render: () => <AnimatedThemeTogglerSquareDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerSquareDemoExampleSource, language: "tsx" } },
  },
};

export const Star: StoryObj = {
  render: () => <AnimatedThemeTogglerStarDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerStarDemoExampleSource, language: "tsx" } },
  },
};

export const Triangle: StoryObj = {
  render: () => <AnimatedThemeTogglerTriangleDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedThemeTogglerTriangleDemoExampleSource, language: "tsx" } },
  },
};
