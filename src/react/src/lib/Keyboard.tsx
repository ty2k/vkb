import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

import type {
  Key,
  ButtonRenderContext,
  ButtonPropsFor,
  SharedButtonProps,
} from "./types";

import { KeyboardKey } from "./KeyboardKey";

export interface KeyboardProps<
  C extends ElementType,
  ActionProp extends keyof ButtonPropsFor<C>,
> extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "id" | "role" | "aria-label" | "aria-labelledby"
> {
  /** Unique identifier for the keyboard */
  id: string;
  /** Rows - an array of Key arrays */
  rows: Key[][];
  /** Default function that fires when a key is pressed */
  handlePress?: (key: Key) => void;
  /** ARIA label for the keyboard */
  ariaLabel?: string;
  /** ARIA labelled-by for the keyboard, if applicable */
  ariaLabelledBy?: string;
  /** ARIA role for the keyboard, defaults to `region` */
  ariaRole?: string;
  /** Button component used to render each key */
  ButtonComponent: C;
  /** The button action prop (for example `"onClick"` or `"onPress"`) */
  buttonActionProp: ActionProp;
  /** Shared props passed to every key button */
  buttonProps?: SharedButtonProps<C, ActionProp>;
  /** Optional callback for per-key button props */
  getButtonProps?: (
    context: ButtonRenderContext
  ) => Partial<SharedButtonProps<C, ActionProp>>;
  /**
   * Number of milliseconds to allow a shift/caps lock double press for
   * `KeyObject` keys with `special: "shift-or-caps"` to enable caps lock mode.
   *
   * This defaults to 300 milliseconds if not specified.
   *
   * (Think of your mobile phone's keyboard and double-pressing the shift button
   * to get caps lock - this sets the max amount of time between the first press
   * and the second press for caps lock to work!)
   */
  shiftOrCapsDoublePressMilliseconds?: number;
}

export function Keyboard<
  C extends ElementType,
  ActionProp extends keyof ButtonPropsFor<C>,
>({
  id,
  rows,
  handlePress = () => {},
  ariaLabel,
  ariaLabelledBy,
  ariaRole = "region",
  ButtonComponent,
  buttonActionProp,
  buttonProps,
  getButtonProps,
  shiftOrCapsDoublePressMilliseconds = 300,
  ...divProps
}: KeyboardProps<C, ActionProp>) {
  const [isShiftMode, setIsShiftMode] = useState(false);
  const [isCapsMode, setIsCapsMode] = useState(false);
  const lastShiftOrCapsPressAtRef = useRef<number | null>(null);

  const isUppercaseMode = isCapsMode || isShiftMode;

  const handleKeyPress = (key: Key) => {
    // Fire the `handlePress()` function passed in by the consumer first.
    handlePress(key);

    // If a `KeyObject` with `special` set to "shift", "caps", or
    // "shift-or-caps") is pressed, exit both shift and caps modes.
    // Any other key input isn't affected because `handlePress()` has already
    // been dispatched.
    if (
      typeof key === "object" &&
      (key.special === "shift" ||
        key.special === "caps" ||
        key.special === "shift-or-caps")
    ) {
      setIsShiftMode(false);
      setIsCapsMode(false);

      // If shift mode is active and a regular key is pressed, exit shift mode
      // so only that single character is uppercase.
    } else if (isShiftMode) {
      setIsShiftMode(false);
    }
  };

  // Handle `KeyObject` presses with `special: "shift-or-caps"`,
  // which should behave similarly to a mobile phone keyboard shift.
  const handleShiftOrCapsPress = () => {
    const now = Date.now();
    const lastPressAt = lastShiftOrCapsPressAtRef.current;

    if (
      lastPressAt !== null &&
      now - lastPressAt <= shiftOrCapsDoublePressMilliseconds
    ) {
      setIsCapsMode((prev) => !prev);
      setIsShiftMode(false);
      lastShiftOrCapsPressAtRef.current = null;
      return;
    }

    lastShiftOrCapsPressAtRef.current = null;
    setIsShiftMode((prev) => !prev);
  };

  const ariaAttributes: Record<string, string> = {
    role: ariaRole,
  };

  if (ariaLabelledBy) {
    ariaAttributes["aria-labelledby"] = ariaLabelledBy;
  } else if (ariaLabel) {
    ariaAttributes["aria-label"] = ariaLabel;
  }

  return (
    <div id={`vkb-${id}`} {...divProps} {...ariaAttributes}>
      <div>
        {rows.map((row, rowIndex) => {
          return (
            <div key={`row-${rowIndex}`}>
              {row.map((key, keyIndex) => {
                const keyId = typeof key === "string" ? key : key.k;

                // Shift key
                if (typeof key === "object" && key?.special === "shift") {
                  return (
                    <KeyboardKey
                      key={`key-${rowIndex}-${keyIndex}-${keyId}`}
                      k={key}
                      onActivate={() => setIsShiftMode((prev) => !prev)}
                      isShiftMode={isUppercaseMode}
                      ButtonComponent={ButtonComponent}
                      buttonActionProp={buttonActionProp}
                      buttonProps={buttonProps}
                      getButtonProps={getButtonProps}
                    />
                  );
                }

                // Caps lock key
                if (typeof key === "object" && key?.special === "caps") {
                  return (
                    <KeyboardKey
                      key={`key-${rowIndex}-${keyIndex}-${keyId}`}
                      k={key}
                      onActivate={() => {
                        setIsCapsMode((prev) => !prev);
                        setIsShiftMode(false);
                      }}
                      isShiftMode={isUppercaseMode}
                      ButtonComponent={ButtonComponent}
                      buttonActionProp={buttonActionProp}
                      buttonProps={buttonProps}
                      getButtonProps={getButtonProps}
                    />
                  );
                }

                // Shift key with double-click-to-caps behavior
                if (
                  typeof key === "object" &&
                  key?.special === "shift-or-caps"
                ) {
                  return (
                    <KeyboardKey
                      key={`key-${rowIndex}-${keyIndex}-${keyId}`}
                      k={key}
                      onActivate={handleShiftOrCapsPress}
                      isShiftMode={isUppercaseMode}
                      ButtonComponent={ButtonComponent}
                      buttonActionProp={buttonActionProp}
                      buttonProps={buttonProps}
                      getButtonProps={getButtonProps}
                    />
                  );
                }

                // All plain string keys
                if (typeof key === "string") {
                  return (
                    <KeyboardKey
                      key={`key-${rowIndex}-${keyIndex}-${key}`}
                      k={key}
                      onActivate={handleKeyPress}
                      isShiftMode={isUppercaseMode}
                      ButtonComponent={ButtonComponent}
                      buttonActionProp={buttonActionProp}
                      buttonProps={buttonProps}
                      getButtonProps={getButtonProps}
                    />
                  );
                }

                // Default case is `KeyObject` objects
                const keyWithShiftAwareCallback =
                  typeof key === "object" && key.cb
                    ? {
                        ...key,
                        cb: (pressedKey: string) => {
                          key.cb?.(pressedKey);

                          if (isShiftMode) {
                            setIsShiftMode(false);
                          }
                        },
                      }
                    : key;

                return (
                  <KeyboardKey
                    key={`key-${rowIndex}-${keyIndex}-${keyId}`}
                    k={keyWithShiftAwareCallback}
                    onActivate={handleKeyPress}
                    isShiftMode={isUppercaseMode}
                    ButtonComponent={ButtonComponent}
                    buttonActionProp={buttonActionProp}
                    buttonProps={buttonProps}
                    getButtonProps={getButtonProps}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
