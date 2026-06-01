import { describe, expect, it } from "vitest";

import { getKeyLabel } from "../lib/getKeyLabel";

import type { KeyString, KeyObject } from "../lib/types";

describe("getKeyValue()", () => {
  const notShiftMode = false;
  const shiftMode = true;

  it("handles a Key string", () => {
    const testKey: KeyString = "s";
    expect(getKeyLabel(testKey, notShiftMode)).toEqual("s");
    expect(getKeyLabel(testKey, shiftMode)).toEqual("S");
  });

  it("handles a minimal KeyObject object", () => {
    const testKeyObject: KeyObject = {
      k: "s",
    };

    expect(getKeyLabel(testKeyObject, notShiftMode)).toEqual("s");
    expect(getKeyLabel(testKeyObject, shiftMode)).toEqual("S");
  });

  it("handles a maximal KeyObject object without a callback", () => {
    const testKeyObject: KeyObject = {
      k: "s",
      v: "s",
      uK: "S",
      uV: "S",
    };

    expect(getKeyLabel(testKeyObject, notShiftMode)).toEqual("s");
    expect(getKeyLabel(testKeyObject, shiftMode)).toEqual("S");
  });

  it("handles a KeyObject with a missing uppercase value", () => {
    const testKeyObject: KeyObject = {
      k: "s",
      v: "s",
      uK: "S",
    };

    expect(getKeyLabel(testKeyObject, notShiftMode)).toEqual("s");
    expect(getKeyLabel(testKeyObject, shiftMode)).toEqual("S");
  });

  it("handles a KeyObject with a missing uppercase text display", () => {
    const testKeyObject: KeyObject = {
      k: "s",
      v: "s",
      uV: "S",
    };

    expect(getKeyLabel(testKeyObject, notShiftMode)).toEqual("s");
    expect(getKeyLabel(testKeyObject, shiftMode)).toEqual("S");
  });

  it("handles a KeyObject with a missing lowercase value", () => {
    const testKeyObject: KeyObject = {
      k: "s",
      uK: "S",
      uV: "S",
    };

    expect(getKeyLabel(testKeyObject, notShiftMode)).toEqual("s");
    expect(getKeyLabel(testKeyObject, shiftMode)).toEqual("S");
  });

  it("handles a KeyObject with only a lowercase value and text display", () => {
    const testKeyObject: KeyObject = {
      k: "s",
      v: "s",
    };

    expect(getKeyLabel(testKeyObject, notShiftMode)).toEqual("s");
    expect(getKeyLabel(testKeyObject, shiftMode)).toEqual("S");
  });

  it("handles a KeyObject with only an empty string for `k`", () => {
    const testKeyObject: KeyObject = {
      k: "",
    };

    expect(getKeyLabel(testKeyObject, notShiftMode)).toEqual("");
    expect(getKeyLabel(testKeyObject, shiftMode)).toEqual("");
  });
});
