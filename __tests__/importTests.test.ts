import { describe, expect, it, vi } from "vitest";

vi.mock("react", () => ({
  createElement: vi.fn(),
  useRef: vi.fn(() => ({ current: null })),
  useState: vi.fn((initial: unknown) => [initial, vi.fn()]),
}));

vi.mock("react/jsx-runtime", () => ({
  jsx: vi.fn(),
}));

describe("dist entrypoint exports", () => {
  it("imports the root dist module and exposes VkbReactKeyboard", async () => {
    const rootModule = await import("../dist/index.js");

    expect(rootModule).toHaveProperty("VkbReactKeyboard");
    expect(Object.keys(rootModule).sort()).toEqual(["VkbReactKeyboard"]);
    expect(typeof rootModule.VkbReactKeyboard).toBe("function");
  });

  it("imports the react dist module and exposes Keyboard", async () => {
    const rootModule = await import("../dist/index.js");
    const reactModule = await import("../dist/react/index.js");

    expect(reactModule).toHaveProperty("Keyboard");
    expect(Object.keys(reactModule).sort()).toEqual(["Keyboard"]);
    expect(typeof reactModule.Keyboard).toBe("function");
    expect(reactModule.Keyboard).toBe(rootModule.VkbReactKeyboard);
  });
});
