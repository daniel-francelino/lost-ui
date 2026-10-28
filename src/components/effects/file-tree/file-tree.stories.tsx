import type { Meta, StoryObj } from "@storybook/react-vite";
import FileTreeDemoExample from "./examples/file-tree-demo";
import fileTreeDemoExampleSource from "./examples/file-tree-demo.tsx?raw";

import { Tree, Folder, File } from "./file-tree";

const meta = {
  title: "Effects/Layout/FileTree",
  component: Tree,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
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

export const Default: StoryObj = {
  render: () => <FileTreeDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: fileTreeDemoExampleSource, language: "tsx" } },
  },
};
