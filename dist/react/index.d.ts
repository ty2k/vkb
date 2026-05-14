import { ComponentPropsWithoutRef, ElementType } from "react";

//#region dist/types/types.d.ts
/**
 * A `KeyString` is the simplest possible representation of what should go on
 * the face of the button.
 *
 * The display text and underlying value are the same, and no special callback
 * function can be specified (unlike with a {@link KeyObject})
 *
 * This can be considered the "default case".
 */
type KeyString = string;
/**
 * A `KeyObject` represents a more complex key where what the key displays and
 * the value associated with pressing it can be different.
 *
 * Unlike with a {@link KeyString}, uppercase is handled manually. In shift
 * mode, the key can be totally different (another symbol, for example).
 *
 * A callback `cb` can be specified.
 */
interface KeyObject {
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
type Key = KeyString | KeyObject;
/**
 * Props available for the passed button component.
 */
type ButtonPropsFor<C extends ElementType> = ComponentPropsWithoutRef<C>;
/**
 * The shared button component props that will be passed to each keyboard key.
 */
type SharedButtonProps<C extends ElementType, ActionProp extends keyof ButtonPropsFor<C>> = Omit<ButtonPropsFor<C>, ActionProp | "children">;
/**
 * Render context for the button.
 */
interface ButtonRenderContext {
  /** The {@link KeyString} or {@link KeyObject} being rendered. */
  keyDef: Key;
  /** Is the key being returned the shift key. */
  isShiftKey: boolean;
  /** Is the keyboard in shift mode. */
  isShiftMode: boolean;
  label: string;
  value: string;
}
//#endregion
//#region dist/types/Keyboard.d.ts
interface KeyboardProps<C extends ElementType, ActionProp extends keyof ButtonPropsFor<C>> extends Omit<ComponentPropsWithoutRef<"div">, "children" | "id" | "role" | "aria-label" | "aria-labelledby"> {
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
  getButtonProps?: (context: ButtonRenderContext) => Partial<SharedButtonProps<C, ActionProp>>;
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
declare function Keyboard<C extends ElementType, ActionProp extends keyof ButtonPropsFor<C>>({
  id,
  rows,
  handlePress,
  ariaLabel,
  ariaLabelledBy,
  ariaRole,
  ButtonComponent,
  buttonActionProp,
  buttonProps,
  getButtonProps,
  shiftOrCapsDoublePressMilliseconds,
  ...divProps
}: KeyboardProps<C, ActionProp>): import("react/jsx-runtime").JSX.Element;
//#endregion
export { type Key, Keyboard };