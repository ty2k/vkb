import type { Key } from "./types";

/**
 * Return a string value for the key button given a {@link Key} and
 * shift state.
 *
 * @param {Key} key key The `KeyString` or `KeyObject`
 * @param {boolean} isShiftMode Whether or not the keyboard is in shift mode
 * @returns {string} The value for the `KeyString` or `KeyObject`
 */
export function getKeyValue(key: Key, isShiftMode: boolean): string {
  // Handle `KeyString` input for `Key`.
  if (typeof key === "string") {
    return isShiftMode ? key.toLocaleUpperCase() : key;
  }

  // All remaining cases below handle `KeyObject` input for `Key`.

  // Handle shift mode.
  if (isShiftMode) {
    // If the uppercase value is supplied, use that.
    if (key.uV) return key.uV;

    // If the uppercase value isn't supplied,
    if (!key.uV) {
      // If the uppercase text display is supplied, prefer to use that.
      if (key.uK) return key.uK;

      // Failing that, if a lowercase value is supplied,
      // infer the uppercase value from the lowercase one.
      if (key.v) return key.v.toLocaleUpperCase();

      // Failing that, if no lowercase value or uppercase text display is
      // supplied, infer the uppercase value from the key display text.
      if (!key.v) return key.k.toLocaleUpperCase();
    }
  }

  // In the default case, prefer returning the key's value if specified,
  // and fall back to the key's text display if not.
  return key.v ?? key.k;
}
