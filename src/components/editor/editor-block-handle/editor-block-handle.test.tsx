import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EditorBlockHandle } from "./editor-block-handle";

describe("EditorBlockHandle", () => {
  it("draws nothing without an editor", () => {
    const { container } = render(<EditorBlockHandle editor={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
