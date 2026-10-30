import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { setProjectAnnotations } from "@storybook/react-vite";
import { MotionGlobalConfig } from "motion/react";
import { afterEach, vi } from "vitest";

import * as previewAnnotations from "../../.storybook/preview";

setProjectAnnotations([previewAnnotations]);

// animations finish at once, so a test does not wait for an exit or a swap
MotionGlobalConfig.skipAnimations = true;

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("ResizeObserver", ObserverStub);
vi.stubGlobal("IntersectionObserver", ObserverStub);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

const context2d = new Proxy(
  { canvas: null },
  {
    get: (target, key) => {
      if (key in target) return Reflect.get(target, key);
      if (key === "measureText") return () => ({ width: 8 });
      if (key === "getImageData") return () => ({ data: new Uint8ClampedArray(4) });
      if (key === "createLinearGradient" || key === "createRadialGradient") {
        return () => ({ addColorStop: () => {} });
      }
      return () => {};
    },
    set: () => true,
  },
);

HTMLCanvasElement.prototype.getContext = (() => context2d) as never;
// current Chrome returns a Promise; effects that return it crash React ("destroy is not a function")
Element.prototype.scrollIntoView = (() => Promise.resolve()) as never;

// ProseMirror measures the selection with ranges; jsdom has no layout, so they measure nothing
const emptyRect = { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
Range.prototype.getBoundingClientRect = () => ({ ...emptyRect, toJSON: () => emptyRect });
Range.prototype.getClientRects = () => [] as unknown as DOMRectList;

afterEach(() => {
  cleanup();
});

Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};

vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  const { cloneElement } = await import("react");

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) =>
      cloneElement(children as React.ReactElement<{ width: number; height: number }>, {
        width: 400,
        height: 300,
      }),
  };
});
