import { createElement, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/lib/getKeyLabel.ts
/**
* Return a visual label for the key button given a {@link Key} and
* shift state.
*
* @param {Key} key The `KeyString` or `KeyObject`
* @param {boolean} isShiftMode Whether or not the keyboard is in shift mode
* @returns {string} The label for the `KeyString` or `KeyObject`
*/
function getKeyLabel(key, isShiftMode) {
	if (typeof key === "string") return isShiftMode ? key.toLocaleUpperCase() : key;
	if (isShiftMode) {
		if (key.uK) return key.uK;
		if (!key.uK) return key.k.toLocaleUpperCase();
	}
	return key.k;
}
//#endregion
//#region src/lib/getKeyValue.ts
/**
* Return a string value for the key button given a {@link Key} and
* shift state.
*
* @param {Key} key key The `KeyString` or `KeyObject`
* @param {boolean} isShiftMode Whether or not the keyboard is in shift mode
* @returns {string} The value for the `KeyString` or `KeyObject`
*/
function getKeyValue(key, isShiftMode) {
	if (typeof key === "string") return isShiftMode ? key.toLocaleUpperCase() : key;
	if (isShiftMode) {
		if (key.uV) return key.uV;
		if (!key.uV) {
			if (key.uK) return key.uK;
			if (key.v) return key.v.toLocaleUpperCase();
			if (!key.v) return key.k.toLocaleUpperCase();
		}
	}
	return key.v ?? key.k;
}
//#endregion
//#region src/lib/KeyboardKey.tsx
function KeyboardKey({ k, onActivate, isShiftMode, ButtonComponent, buttonActionProp, buttonProps, getButtonProps }) {
	const isShiftKey = typeof k === "object" && (k?.special === "shift" || k?.special === "shift-or-caps");
	const label = getKeyLabel(k, isShiftMode);
	const value = getKeyValue(k, isShiftMode);
	const perKeyButtonProps = getButtonProps?.({
		keyDef: k,
		isShiftKey,
		isShiftMode,
		label,
		value
	});
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
	const actionProp = { [buttonActionProp]: handleAction };
	return createElement(ButtonComponent, {
		...buttonProps ?? {},
		...perKeyButtonProps ?? {},
		...actionProp
	}, label);
}
//#endregion
//#region src/lib/Keyboard.tsx
function Keyboard({ id, rows, handlePress = () => {}, ariaLabel, ariaLabelledBy, ariaRole = "region", ButtonComponent, buttonActionProp, buttonProps, getButtonProps, shiftOrCapsDoublePressMilliseconds = 300, ...divProps }) {
	const [isShiftMode, setIsShiftMode] = useState(false);
	const [isCapsMode, setIsCapsMode] = useState(false);
	const lastShiftOrCapsPressAtRef = useRef(null);
	const isUppercaseMode = isCapsMode || isShiftMode;
	const handleKeyPress = (key) => {
		handlePress(key);
		if (typeof key === "object" && (key.special === "shift" || key.special === "caps" || key.special === "shift-or-caps")) {
			setIsShiftMode(false);
			setIsCapsMode(false);
		} else if (isShiftMode) setIsShiftMode(false);
	};
	const handleShiftOrCapsPress = () => {
		const now = Date.now();
		const lastPressAt = lastShiftOrCapsPressAtRef.current;
		if (lastPressAt !== null && now - lastPressAt <= shiftOrCapsDoublePressMilliseconds) {
			setIsCapsMode((prev) => !prev);
			setIsShiftMode(false);
			lastShiftOrCapsPressAtRef.current = null;
			return;
		}
		lastShiftOrCapsPressAtRef.current = null;
		setIsShiftMode((prev) => !prev);
	};
	const ariaAttributes = { role: ariaRole };
	if (ariaLabelledBy) ariaAttributes["aria-labelledby"] = ariaLabelledBy;
	else if (ariaLabel) ariaAttributes["aria-label"] = ariaLabel;
	return /* @__PURE__ */ jsx("div", {
		id: `vkb-${id}`,
		...divProps,
		...ariaAttributes,
		children: /* @__PURE__ */ jsx("div", { children: rows.map((row, rowIndex) => {
			return /* @__PURE__ */ jsx("div", { children: row.map((key, keyIndex) => {
				const keyId = typeof key === "string" ? key : key.k;
				if (typeof key === "object" && key?.special === "shift") return /* @__PURE__ */ jsx(KeyboardKey, {
					k: key,
					onActivate: () => setIsShiftMode((prev) => !prev),
					isShiftMode: isUppercaseMode,
					ButtonComponent,
					buttonActionProp,
					buttonProps,
					getButtonProps
				}, `key-${rowIndex}-${keyIndex}-${keyId}`);
				if (typeof key === "object" && key?.special === "caps") return /* @__PURE__ */ jsx(KeyboardKey, {
					k: key,
					onActivate: () => {
						setIsCapsMode((prev) => !prev);
						setIsShiftMode(false);
					},
					isShiftMode: isUppercaseMode,
					ButtonComponent,
					buttonActionProp,
					buttonProps,
					getButtonProps
				}, `key-${rowIndex}-${keyIndex}-${keyId}`);
				if (typeof key === "object" && key?.special === "shift-or-caps") return /* @__PURE__ */ jsx(KeyboardKey, {
					k: key,
					onActivate: handleShiftOrCapsPress,
					isShiftMode: isUppercaseMode,
					ButtonComponent,
					buttonActionProp,
					buttonProps,
					getButtonProps
				}, `key-${rowIndex}-${keyIndex}-${keyId}`);
				if (typeof key === "string") return /* @__PURE__ */ jsx(KeyboardKey, {
					k: key,
					onActivate: handleKeyPress,
					isShiftMode: isUppercaseMode,
					ButtonComponent,
					buttonActionProp,
					buttonProps,
					getButtonProps
				}, `key-${rowIndex}-${keyIndex}-${key}`);
				return /* @__PURE__ */ jsx(KeyboardKey, {
					k: typeof key === "object" && key.cb ? {
						...key,
						cb: (pressedKey) => {
							key.cb?.(pressedKey);
							if (isShiftMode) setIsShiftMode(false);
						}
					} : key,
					onActivate: handleKeyPress,
					isShiftMode: isUppercaseMode,
					ButtonComponent,
					buttonActionProp,
					buttonProps,
					getButtonProps
				}, `key-${rowIndex}-${keyIndex}-${keyId}`);
			}) }, `row-${rowIndex}`);
		}) })
	});
}
//#endregion
export { Keyboard };
