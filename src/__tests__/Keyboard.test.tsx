// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Keyboard } from "../lib/Keyboard";

afterEach(() => {
  cleanup();
});

describe("Keyboard", () => {
  it("applies shift for only one non-modifier key press", () => {
    const handlePress = vi.fn();

    render(
      <Keyboard
        id="qwerty-shift-once"
        rows={[[{ k: "⇧ Shift", uK: "⇧ Shift", special: "shift" }, "a", "b"]]}
        ButtonComponent="button"
        buttonActionProp="onClick"
        handlePress={handlePress}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "b" }));

    expect(handlePress).toHaveBeenCalledTimes(2);
    expect(handlePress).toHaveBeenNthCalledWith(1, "A");
    expect(handlePress).toHaveBeenNthCalledWith(2, "b");
  });

  it("toggles caps lock persistently until pressed again", () => {
    const handlePress = vi.fn();

    render(
      <Keyboard
        id="qwerty-caps"
        rows={[
          [{ k: "Caps Lock", uK: "Caps Lock", special: "caps" }, "a", "b", "c"],
        ]}
        ButtonComponent="button"
        buttonActionProp="onClick"
        handlePress={handlePress}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Caps Lock" }));
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    fireEvent.click(screen.getByRole("button", { name: "C" }));

    fireEvent.click(screen.getByRole("button", { name: "Caps Lock" }));
    fireEvent.click(screen.getByRole("button", { name: "c" }));

    expect(handlePress).toHaveBeenCalledTimes(4);
    expect(handlePress).toHaveBeenNthCalledWith(1, "A");
    expect(handlePress).toHaveBeenNthCalledWith(2, "B");
    expect(handlePress).toHaveBeenNthCalledWith(3, "C");
    expect(handlePress).toHaveBeenNthCalledWith(4, "c");
  });

  it("emits shifted symbol values for KeyObject keys", () => {
    const handlePress = vi.fn();

    render(
      <Keyboard
        id="qwerty-symbols"
        rows={[
          [
            { k: "⇧ Shift", uK: "⇧ Shift", special: "shift" },
            { k: "1", uK: "!" },
            { k: "2", uK: "@" },
          ],
        ]}
        ButtonComponent="button"
        buttonActionProp="onClick"
        handlePress={handlePress}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));
    fireEvent.click(screen.getByRole("button", { name: "!" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(handlePress).toHaveBeenCalledTimes(2);
    expect(handlePress).toHaveBeenNthCalledWith(1, "!");
    expect(handlePress).toHaveBeenNthCalledWith(2, "2");
  });

  it("consumes one-shot shift when pressing callback keys", () => {
    const handlePress = vi.fn();
    const handleBackspace = vi.fn();

    render(
      <Keyboard
        id="qwerty-callback"
        rows={[
          [
            { k: "⇧ Shift", uK: "⇧ Shift", special: "shift" },
            { k: "Backspace ⌫", uK: "Backspace ⌫", cb: handleBackspace },
            "a",
          ],
        ]}
        ButtonComponent="button"
        buttonActionProp="onClick"
        handlePress={handlePress}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));
    fireEvent.click(screen.getByRole("button", { name: "Backspace ⌫" }));
    fireEvent.click(screen.getByRole("button", { name: "a" }));

    expect(handleBackspace).toHaveBeenCalledTimes(1);
    expect(handleBackspace).toHaveBeenCalledWith("Backspace ⌫");
    expect(handlePress).toHaveBeenCalledTimes(1);
    expect(handlePress).toHaveBeenCalledWith("a");
  });

  it("uses one-shot shift on single press for shift-or-caps", () => {
    const handlePress = vi.fn();

    render(
      <Keyboard
        id="qwerty-shift-or-caps-single"
        rows={[
          [{ k: "⇧ Shift", uK: "⇧ Shift", special: "shift-or-caps" }, "a", "b"],
        ]}
        ButtonComponent="button"
        buttonActionProp="onClick"
        handlePress={handlePress}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "b" }));

    expect(handlePress).toHaveBeenCalledTimes(2);
    expect(handlePress).toHaveBeenNthCalledWith(1, "A");
    expect(handlePress).toHaveBeenNthCalledWith(2, "b");
  });

  it("toggles persistent caps lock on double press for shift-or-caps", () => {
    const handlePress = vi.fn();

    render(
      <Keyboard
        id="qwerty-shift-or-caps-double"
        rows={[
          [{ k: "⇧ Shift", uK: "⇧ Shift", special: "shift-or-caps" }, "a", "b"],
        ]}
        ButtonComponent="button"
        buttonActionProp="onClick"
        handlePress={handlePress}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));
    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "B" }));

    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));
    fireEvent.click(screen.getByRole("button", { name: "⇧ Shift" }));
    fireEvent.click(screen.getByRole("button", { name: "b" }));

    expect(handlePress).toHaveBeenCalledTimes(3);
    expect(handlePress).toHaveBeenNthCalledWith(1, "A");
    expect(handlePress).toHaveBeenNthCalledWith(2, "B");
    expect(handlePress).toHaveBeenNthCalledWith(3, "b");
  });

  it("spreads additional div props onto the outer container", () => {
    render(
      <Keyboard
        id="qwerty-div-props"
        rows={[["a"]]}
        ButtonComponent="button"
        buttonActionProp="onClick"
        className="custom-keyboard"
        data-testid="keyboard-root"
        data-layout="compact"
      />
    );

    const keyboard = screen.getByTestId("keyboard-root");

    expect(keyboard.className).toContain("custom-keyboard");
    expect(keyboard.getAttribute("data-layout")).toBe("compact");
    expect(keyboard.getAttribute("id")).toBe("vkb-qwerty-div-props");
  });
});
