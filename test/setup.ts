import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/",
  };
});

vi.mock("framer-motion", () => {
  type MotionWrapperProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };

  const motionOnlyProps = new Set([
    "animate",
    "exit",
    "initial",
    "layout",
    "layoutId",
    "transition",
    "variants",
    "whileHover",
    "whileTap",
    "whileDrag",
    "whileInView",
    "drag",
  ]);

  const createMotionElement = (tag: keyof React.JSX.IntrinsicElements) => {
    return React.forwardRef<HTMLElement, MotionWrapperProps>(
      function MotionElement({ children, ...props }, ref) {
        const domProps = Object.fromEntries(
          Object.entries(props).filter(([key]) => !motionOnlyProps.has(key)),
        );

        return React.createElement(tag, { ...domProps, ref }, children);
      },
    );
  };

  const motion = new Proxy(
    {},
    {
      get: (_, tag) =>
        createMotionElement(tag as keyof React.JSX.IntrinsicElements),
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});
