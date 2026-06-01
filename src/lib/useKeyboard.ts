import { useRef, useState } from "react";

import type { Key } from "./types";

export type UppercaseMode = "lowercase" | "shifted" | "caps-locked";

export interface UseKeyboardOptions {
  /** Default function that fires when a key is pressed */
  handlePress?: (key: Key) => void;
  /**
   * Number of milliseconds to allow a shift/caps lock double press for
   * `KeyObject` keys with `special: "shift-or-caps"` to enable caps lock mode.
   */
  shiftOrCapsDoublePressMilliseconds?: number;
}

export interface KeyboardController {
  /**
   * The current uppercase mode for the `Keyboard`:
   *
   * - `lowercase` is the default mode.
   * - `shifted` is a one-shot shift/uppercase like on a mobile phone with a
   *   single shift key press.
   * - `caps-locked` is uppercase mode until it is explicitly exited.
   */
  uppercaseMode: UppercaseMode;
  /** True for either one-shot shift (`shifted`) or caps lock (`caps-locked`) */
  isUppercase: boolean;
  /** True only for one-shot shift (`shifted`) */
  isShifted: boolean;
  /** True only for caps lock (`caps-locked`) */
  isCapsLocked: boolean;
  /** Handles plain and non-callback `KeyObject` activations */
  handleKeyPress: (key: Key) => void;
  /** Handles callback key activations */
  handleCallbackKeyPress: () => void;
  /** Handles `special: "shift"` activations */
  handleShiftPress: () => void;
  /** Handles `special: "caps"` activations */
  handleCapsPress: () => void;
  /** Handles `special: "shift-or-caps"` activations */
  handleShiftOrCapsPress: () => void;
}

export function useKeyboard({
  handlePress = () => {},
  shiftOrCapsDoublePressMilliseconds = 300,
}: UseKeyboardOptions = {}): KeyboardController {
  // Keyboard starts in lowercase mode
  const [uppercaseMode, setUppercaseMode] =
    useState<UppercaseMode>("lowercase");
  // Time in Unix milliseconds of last shift or caps button press
  const lastShiftOrCapsPressAtRef = useRef<number | null>(null);

  const isUppercase = uppercaseMode !== "lowercase";
  const isShifted = uppercaseMode === "shifted";
  const isCapsLocked = uppercaseMode === "caps-locked";

  const resetShiftOrCapsWindow = () => {
    lastShiftOrCapsPressAtRef.current = null;
  };

  const setLowercaseMode = () => {
    setUppercaseMode("lowercase");
    resetShiftOrCapsWindow();
  };

  const consumeOneShotShift = () => {
    resetShiftOrCapsWindow();

    if (uppercaseMode === "shifted") {
      setUppercaseMode("lowercase");
    }
  };

  const handleKeyPress = (key: Key) => {
    handlePress(key);
    consumeOneShotShift();
  };

  const handleCallbackKeyPress = () => {
    consumeOneShotShift();
  };

  const handleShiftPress = () => {
    if (isUppercase) {
      setLowercaseMode();
      return;
    }

    setUppercaseMode("shifted");
    resetShiftOrCapsWindow();
  };

  const handleCapsPress = () => {
    if (isUppercase) {
      setLowercaseMode();
      return;
    }

    setUppercaseMode("caps-locked");
    resetShiftOrCapsWindow();
  };

  const handleShiftOrCapsPress = () => {
    const now = Date.now();
    const lastPressAt = lastShiftOrCapsPressAtRef.current;
    const isDoublePress =
      lastPressAt !== null &&
      now - lastPressAt <= shiftOrCapsDoublePressMilliseconds;

    if (isDoublePress) {
      setUppercaseMode("caps-locked");
      resetShiftOrCapsWindow();
      return;
    }

    if (isUppercase) {
      setLowercaseMode();
      return;
    }

    lastShiftOrCapsPressAtRef.current = now;
    setUppercaseMode("shifted");
  };

  return {
    uppercaseMode,
    isUppercase,
    isShifted,
    isCapsLocked,
    handleKeyPress,
    handleCallbackKeyPress,
    handleShiftPress,
    handleCapsPress,
    handleShiftOrCapsPress,
  };
}
