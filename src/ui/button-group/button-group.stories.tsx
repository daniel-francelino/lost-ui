import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

import { Badge } from "../badge";
import { Button } from "../button";
import { Input } from "../input";
import { ButtonGroup } from "./button-group";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    "aria-label": "Alignment",
    children: (
      <>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = { args: { orientation: "vertical" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="grid justify-items-start gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <ButtonGroup key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const WithInput: Story = {
  args: {
    "aria-label": "Search",
    children: (
      <>
        <Input placeholder="Search…" aria-label="Search" className="w-56" />
        <Button variant="outline" aria-label="Go">
          <SearchIcon />
        </Button>
      </>
    ),
  },
};

export const WithBadge: Story = {
  args: {
    "aria-label": "Website",
    children: (
      <>
        <Badge variant="outline" className="rounded-r-none px-3">
          https://
        </Badge>
        <Input placeholder="example.com" aria-label="Domain" />
      </>
    ),
  },
};

export const Split: Story = {
  args: {
    "aria-label": "Save",
    children: (
      <>
        <Button>Save</Button>
        <Button size="icon" aria-label="More options">
          <ChevronDownIcon />
        </Button>
      </>
    ),
  },
};
