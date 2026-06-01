import { createElement, type ElementType } from "react";

import type {
  Key,
  ButtonRenderContext,
  ButtonPropsFor,
  SharedButtonProps,
} from "./types";
import { getKeyLabel } from "./getKeyLabel";
import { getKeyValue } from "./getKeyValue";

export interface KeyboardKeyProps<
  C extends ElementType,
  ActionProp extends keyof ButtonPropsFor<C>,
> {
  /** The key to be rendered, either a `KeyString` or `KeyObject` */
  k: Key;
  /** Function that fires when a key is pressed */
  onActivate: (key: Key) => void;
  /** Is the keyboard in shift mode */
  isShiftMode: boolean;
  /** Button component used to render each key */
  ButtonComponent: C;
  /** The action prop name to use on the button,
   * (for example `"onClick"` or `"onPress"`) */
  buttonActionProp: ActionProp;
  /** Shared props passed to every key button */
  buttonProps?: SharedButtonProps<C, ActionProp>;
  /** Optional callback for per-key button props */
  getButtonProps?: (
    context: ButtonRenderContext
  ) => Partial<SharedButtonProps<C, ActionProp>>;
}

export function KeyboardKey<
  C extends ElementType,
  ActionProp extends keyof ButtonPropsFor<C>,
>({
  k,
  onActivate,
  isShiftMode,
  ButtonComponent,
  buttonActionProp,
  buttonProps,
  getButtonProps,
}: KeyboardKeyProps<C, ActionProp>) {
  // Treat shift-or-caps as a shift key for render context/styling purposes.
  const isShiftKey =
    typeof k === "object" &&
    (k?.special === "shift" || k?.special === "shift-or-caps");
  const label = getKeyLabel(k, isShiftMode);
  const value = getKeyValue(k, isShiftMode);

  const context: ButtonRenderContext = {
    keyDef: k,
    isShiftKey,
    isShiftMode,
    label,
    value,
  };

  const perKeyButtonProps = getButtonProps?.(context);

  const handleAction = () => {
    if (typeof k === "string") {
      onActivate(isShiftKey ? k : value);
      return;
    }

    if (k.cb) {
      k.cb(value);
      return;
    }

    onActivate(value);
  };

  // Bind the action handler to whichever prop
  // the supplied button component expects.
  const actionProp = {
    [buttonActionProp]: handleAction,
  } as Pick<ButtonPropsFor<C>, ActionProp>;

  const mergedProps = {
    ...(buttonProps ?? {}),
    ...(perKeyButtonProps ?? {}),
  } as SharedButtonProps<C, ActionProp>;

  return createElement(
    ButtonComponent,
    {
      ...(mergedProps as ButtonPropsFor<C>),
      ...(actionProp as ButtonPropsFor<C>),
    },
    label
  );
}
