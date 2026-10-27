import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./input-otp.stories";

const { Default } = composeStories(stories);

describe("InputOTP", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the hidden input limited to six characters", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("input")).toHaveAttribute("maxlength", "6");
  });
});
