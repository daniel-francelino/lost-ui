import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EditorTableBar } from "./editor-table-bar";

describe("EditorTableBar", () => {
  it("draws nothing without an editor", () => {
    const { container } = render(<EditorTableBar editor={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
