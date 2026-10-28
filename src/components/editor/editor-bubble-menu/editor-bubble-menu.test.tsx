import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EditorBubbleMenu } from "./editor-bubble-menu";

describe("EditorBubbleMenu", () => {
  it("draws nothing without an editor", () => {
    const { container } = render(<EditorBubbleMenu editor={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
