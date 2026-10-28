import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../ui/button";
import { toast } from "../../ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { App } from "./app";

const meta = {
  title: "App/App",
  component: App,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    children: (
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tip without its own provider</TooltipContent>
        </Tooltip>
        <Button onClick={() => toast.success("Saved")}>Save</Button>
      </div>
    ),
  },
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Portuguese: Story = { args: { language: "pt" } };

export const RightToLeft: Story = { args: { dir: "rtl" } };

export const Dark: Story = { args: { dark: true } };

export const WithoutToaster: Story = { args: { toaster: null } };

export const ToasterOptions: Story = { args: { toaster: { position: "top-center" } } };
