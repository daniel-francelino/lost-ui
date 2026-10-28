import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./sheet";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
