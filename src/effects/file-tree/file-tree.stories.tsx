import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tree, Folder, File } from "./file-tree";

const meta = {
  title: "Effects/Layout/FileTree",
  component: Tree,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initialExpandedItems: ["src"], className: "w-56" },
  render: (args) => (
    <Tree {...args}>
      <Folder element="src" value="src">
        <Folder element="components" value="components">
          <File value="button">
            <p>button.tsx</p>
          </File>
        </Folder>
        <File value="index">
          <p>index.ts</p>
        </File>
      </Folder>
    </Tree>
  ),
};
