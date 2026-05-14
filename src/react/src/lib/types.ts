import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * A `KeyString` is the simplest possible representation of what should go on
 * the face of the button.
 *
 * The display text and underlying value are the same, and no special callback
 * function can be specified (unlike with a {@link KeyObject})
 *
 * This can be considered the "default case".
 */
export type KeyString = string;

/**
 * A `KeyObject` represents a more complex key where what the key displays and
 * the value associated with pressing it can be different.
 *
 * Unlike with a {@link KeyString}, uppercase is handled manually. In shift
 * mode, the key can be totally different (another symbol, for example).
 *
 * A callback `cb` can be specified.
 */
export interface KeyObject {
  /** Lowercase text display for the key */
  k: string;
  /** Lowercase value for the key */
  v?: string;
  /** Uppercase text display for the key */
  uK?: string;
  /** Uppercase value for the key */
  uV?: string;
  /**
   * Special functionality:
   *
   * - `shift` - Behaves like a one-shot shift key on a mobile phone (ex: shift
   *             is "held down" for one key press).
   * - `caps` - Behaves like caps lock (ex: shift is "held down" until the
   *            button is pressed again).
   * - `shift-or-caps` - Behaves like a shift key on a mobile phone (ex: press
   *                     shift once to make the next key capitalized, quickly
   *                     double-press shift to turn caps lock on).
   */
  special?: "shift" | "caps" | "shift-or-caps";
  /** Callback fired when the key is pressed */
  cb?: (key: KeyString) => void;
}

/**
 * `Key` is the union of {@link KeyString} and {@link KeyObject} types.
 */
export type Key = KeyString | KeyObject;

/**
 * Props available for the passed button component.
 */
export type ButtonPropsFor<C extends ElementType> = ComponentPropsWithoutRef<C>;

/**
 * The shared button component props that will be passed to each keyboard key.
 */
export type SharedButtonProps<
  C extends ElementType,
  ActionProp extends keyof ButtonPropsFor<C>,
> = Omit<ButtonPropsFor<C>, ActionProp | "children">;

/**
 * Render context for the button.
 */
export interface ButtonRenderContext {
  /** The {@link KeyString} or {@link KeyObject} being rendered. */
  keyDef: Key;
  /** Is the key being returned the shift key. */
  isShiftKey: boolean;
  /** Is the keyboard in shift mode. */
  isShiftMode: boolean;
  label: string;
  value: string;
}
