import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "../../ui/button";
import { PageTransition } from "./page-transition";

const meta = {
  title: "Elements/PageTransition",
  component: PageTransition,
  tags: ["autodocs"],
  args: { transitionKey: 1 },
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPage((p) => p - 1)}>
            Back
          </Button>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
        <PageTransition {...args} transitionKey={page} direction={1}>
          <p className="rounded-lg border p-6">Page {page}</p>
        </PageTransition>
      </div>
    );
  },
} satisfies Meta<typeof PageTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Fade: Story = { args: { variant: "fade" } };

export const Slide: Story = { args: { variant: "slide" } };
