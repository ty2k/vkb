import { describe, expect, it, vi } from "vitest";

import { KeyboardKey } from "../lib/KeyboardKey";

describe("KeyboardKey", () => {
  it("emits shifted value for a KeyObject when shift mode is enabled", () => {
    const onActivate = vi.fn();

    const element = KeyboardKey({
      k: { k: "`", uK: "~" },
      onActivate,
      isUppercase: true,
      isShifted: true,
      isCapsLocked: false,
      ButtonComponent: "button",
      buttonActionProp: "onClick",
    });

    const onClick = (element.props as { onClick: () => void }).onClick;
    onClick();

    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(onActivate).toHaveBeenCalledWith("~");
  });
});
