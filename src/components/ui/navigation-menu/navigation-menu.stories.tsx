import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu";

const meta = {
  title: "UI/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-60 gap-2 p-3 text-sm">
              <li>
                <NavigationMenuLink href="/docs">Introduction</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/docs/install">Installation</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
