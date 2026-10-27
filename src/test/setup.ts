import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { setProjectAnnotations } from "@storybook/react-vite";
import { afterEach, vi } from "vitest";

import * as previewAnnotations from "../../.storybook/preview";

setProjectAnnotations([previewAnnotations]);

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
Element.prototype.scrollIntoView = () => {};

afterEach(() => {
  cleanup();
});

Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};
