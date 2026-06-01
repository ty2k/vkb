import type { Key } from "./types";

/**
 * Return a visual label for the key button given a {@link Key} and
 * uppercase state.
 *
 * @param {Key} key The `KeyString` or `KeyObject`
 * @param {boolean} isUppercase Whether or not the keyboard is in uppercase mode
 * @returns {string} The label for the `KeyString` or `KeyObject`
 */
export function getKeyLabel(key: Key, isUppercase: boolean): string {
  // Handle `KeyString` input for `Key`.
  if (typeof key === "string") {
    // Uppercase mode sets string to uppercase.
    return isUppercase ? key.toLocaleUpperCase() : key;
  }

  // All remaining cases below handle `KeyObject` input for `Key`.

  // Handle uppercase mode.
  if (isUppercase) {
    // If the uppercase text display is supplied, use that.
    if (key.uK) return key.uK;

    // If no uppercase text display is supplied, infer the
    // uppercase value from the lowercase key display text.
    if (!key.uK) return key.k.toLocaleUpperCase();
  }

  // Default case uses the lowercase text display.
  return key.k;
}
