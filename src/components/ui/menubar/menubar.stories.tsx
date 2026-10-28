import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "./menubar";

const meta = {
  title: "UI/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New tab</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
