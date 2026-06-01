import { type ComponentPropsWithoutRef, type ElementType } from "react";

import type {
  Key,
  ButtonRenderContext,
  ButtonPropsFor,
  SharedButtonProps,
} from "./types";

import { KeyboardKey } from "./KeyboardKey";
import { useKeyboard, type KeyboardController } from "./useKeyboard";

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
  /** Optional shared controller for keyboard uppercase + press handling.
   *
   * When provided, the `Keyboard` will use the controller’s handlers (including
   * its configured `handlePress`) instead of this component’s `handlePress`
   * prop.
   */
  keyboardController?: KeyboardController;
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
  keyboardController,
  shiftOrCapsDoublePressMilliseconds = 300,
  ...divProps
}: KeyboardProps<C, ActionProp>) {
  const internalKeyboardController = useKeyboard({
    handlePress,
    shiftOrCapsDoublePressMilliseconds,
  });
  const controller = keyboardController ?? internalKeyboardController;

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
                      onActivate={controller.handleShiftPress}
                      isUppercase={controller.isUppercase}
                      isShifted={controller.isShifted}
                      isCapsLocked={controller.isCapsLocked}
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
                      onActivate={controller.handleCapsPress}
                      isUppercase={controller.isUppercase}
                      isShifted={controller.isShifted}
                      isCapsLocked={controller.isCapsLocked}
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
                      onActivate={controller.handleShiftOrCapsPress}
                      isUppercase={controller.isUppercase}
                      isShifted={controller.isShifted}
                      isCapsLocked={controller.isCapsLocked}
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
                      onActivate={controller.handleKeyPress}
                      isUppercase={controller.isUppercase}
                      isShifted={controller.isShifted}
                      isCapsLocked={controller.isCapsLocked}
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
                          controller.handleCallbackKeyPress();
                        },
                      }
                    : key;

                return (
                  <KeyboardKey
                    key={`key-${rowIndex}-${keyIndex}-${keyId}`}
                    k={keyWithShiftAwareCallback}
                    onActivate={controller.handleKeyPress}
                    isUppercase={controller.isUppercase}
                    isShifted={controller.isShifted}
                    isCapsLocked={controller.isCapsLocked}
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
