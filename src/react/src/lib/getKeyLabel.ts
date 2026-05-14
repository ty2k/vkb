import type { Key } from "./types";

/**
 * Return a visual label for the key button given a {@link Key} and
 * shift state.
 *
 * @param {Key} key The `KeyString` or `KeyObject`
 * @param {boolean} isShiftMode Whether or not the keyboard is in shift mode
 * @returns {string} The label for the `KeyString` or `KeyObject`
 */
export function getKeyLabel(key: Key, isShiftMode: boolean): string {
  // Handle `KeyString` input for `Key`.
  if (typeof key === "string") {
    // Shift mode sets string to uppercase.
    return isShiftMode ? key.toLocaleUpperCase() : key;
  }

  // All remaining cases below handle `KeyObject` input for `Key`.

  // Handle shift mode.
  if (isShiftMode) {
    // If the uppercase text display is supplied, use that.
    if (key.uK) return key.uK;

    // If no uppercase text display is supplied, infer the
    // uppercase value from the lowercase key display text.
    if (!key.uK) return key.k.toLocaleUpperCase();
  }

  // Default case uses the lowercase text display.
  return key.k;
}
