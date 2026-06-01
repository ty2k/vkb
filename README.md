# v-k-b ⌨️

Virtual keyboard library for React front-ends.

- No styles or opinionated button components included - bring your design system components and custom styling.
- Handle your own text field state with key press callbacks, including backspace and clear functions.
- Minimum possible dependencies: `react` and `react-dom` as peer dependencies.

## Install

`npm i v-k-b`

## Use

Import the `VkbReactKeyboard` component and `Key` type:

```tsx
import { VkbReactKeyboard, type Key } from "v-k-b";
```

In your application code, use it with a state management library like `useState`:

```tsx
function App() {
  const [text, setText] = useState("");

  function handleKeyPress(key: Key) {
    if (typeof key === "string") return setText(text + key);
    if (key.v) return setText(text + key.v);
    return setText(text + key.k);
  }

  function handleBackspace() {
    setText(text.substring(0, text.length - 1));
  }

  function handleClear() {
    setText("");
  }

  return (
    <>
      <VkbReactKeyboard
        id="qwerty"
        rows={[
          [
            { k: "`", uK: "~" },
            { k: "1", uK: "!" },
            { k: "2", uK: "@" },
            { k: "3", uK: "#" },
            { k: "4", uK: "$" },
            { k: "5", uK: "%" },
            { k: "6", uK: "^" },
            { k: "7", uK: "&" },
            { k: "8", uK: "*" },
            { k: "9", uK: "(" },
            { k: "0", uK: ")" },
            { k: "-", uK: "_" },
            { k: "=", uK: "+" },
            { k: "Backspace ⌫", uK: "Backspace ⌫", cb: handleBackspace },
            { k: "Clear ⌧", uK: "Clear ⌧", cb: handleClear },
          ],
          [
            "q",
            "w",
            "e",
            "r",
            "t",
            "y",
            "u",
            "i",
            "o",
            "p",
            { k: "[", uK: "{" },
            { k: "]", uK: "}" },
            { k: "\\", uK: "|" },
          ],
          [
            { k: "Caps Lock", uK: "Caps Lock", special: "caps" },
            "a",
            "s",
            "d",
            "f",
            "g",
            "h",
            "j",
            "k",
            "l",
            { k: ";", uK: ":" },
            { k: "'", uK: '"' },
          ],
          [
            { k: "⇧ Shift/Caps", uK: "⇧ Shift/Caps", special: "shift-or-caps" },
            "z",
            "x",
            "c",
            "v",
            "b",
            "n",
            "m",
            { k: ",", uK: "<" },
            { k: ".", uK: ">" },
            { k: "/", uK: "?" },
            { k: "⇧ Shift", uK: "⇧ Shift", special: "shift" },
          ],
          [{ k: "Space", uK: "Space", v: " ", uV: " " }],
        ]}
        ButtonComponent={"button"}
        buttonActionProp={"onClick"}
        handlePress={(key) => handleKeyPress(key)}
        shiftOrCapsDoublePressMilliseconds={200}
      />

      <div>
        <p>
          <span>Input:</span> {text}
        </p>
      </div>
    </>
  );
}
```

### How React button components work

`VkbReactKeyboard` lets you pass your own React button components to use with the keyboard. The `ButtonComponent` prop accepts things like:

- a `Button` imported from a library like React Aria Components
- the string `"button"` to indicate you want to use the browser-native button
- ...or whatever button-like thing you want to pass

Use the `buttonActionProp` prop to pass the name of the click handler for the button. For example, use the string `"onClick"` for a native `<button>` or `"onPress"` for a React Aria Components button.

(Part of the reason for creating this library was being able to use my organization's existing design system button components in a keyboard layout rather than a generic `<button>` or one from a random library with a different API.)

Use the `buttonProps` prop for passing common props to all buttons. For example, pass a custom class name that's used for styling buttons, a `data-*` attribute, etc.

Use the `getButtonProps` callback that receives information about the key being pressed to let you customize the rendering of individual buttons.

### How rows of keys work

`VkbReactKeyboard` accepts a `rows` array prop, which is an array of `Key` arrays.

### How keys work

A `Key` can be a regular string `KeyString`:

```tsx
// The "a" key.
const aKeyString: KeyString = "a";
```

A `Key` can also be a `KeyObject`. These have fields for:

- Strings for lowercase and uppercase text displays and values (in case the text on the button is different that what gets produced by clicking the button):
  - `k`: Lowercase text display for the key
  - `v`: Lowercase value for the key
  - `uK`: Uppercase text display for the key
  - `uV`: Uppercase value for the key
- A callback if you need special handling: `cb`
- Handling is included for `special` keys:
  - `"shift"`: To create a one-shot shift key (press once to enter uppercase mode, uppercase mode exits after the next key is pressed)
  - `"caps"`: To create a caps lock key (press once to enter uppercase mode, press again to exit uppercase mode)
  - `"shift-or-caps"`: To create a mobile phone-style shift key that can be double-pressed for caps lock

A `KeyObject` for a regular key like "a" might look like:

```tsx
// The "a" key.
const aKeyObject: KeyObject = {
  // The `k` text display and `v` value
  // are the same for a key like this.
  k: "a",
  v: "a",

  // The `uK` uppercase text display and `uV` uppercase
  // value are the same for a key like this.
  uK: "A",
  uV: "A",
};
```

A `KeyObject` for a special key like backspace might look like:

```tsx
const backspaceKeyObject: KeyObject = {
  k: "Backspace ⌫",
  uK: "Backspace ⌫",

  // This is a custom function you
  // write and pass to the `KeyObject`.
  cb: handleBackspace,
};
```

### How capitalization (shift and caps lock) works

Keyboards keep track of lowercase/uppercase state internally using React's `useState()`. Keyboards initially start off in lowercase mode. You can access uppercase mode by including a Shift or Caps Lock key:

```tsx
// Shift key
{
  k: "⇧ Shift",
  uK: "⇧ Shift",
  special: "shift"
},
```

```tsx
// Capslock key
{
  k: "Caps Lock",
  uK: "Caps Lock",
  special: "caps"
},
```

You can also use a mobile phone-style "shift or caps lock" key with a double-press:

```tsx
// Double-press the shift key to enter caps lock mode
{
  k: "⇧ Shift/Caps",
  uK: "⇧ Shift/Caps",
  special: "shift-or-caps"
},
```

You can specify the maximum amount of time a `shift-or-caps` button should work to enter caps lock mode by using the `shiftOrCapsDoublePressMilliseconds` prop, which defaults to 300 milliseconds if not specified.

Note that internally, "shift mode" and "caps mode" are different stateful variables. If you enter caps mode, you use a `caps` button press or `shift-or-caps` button double-press to exit it. For this reason, it might be confusing to include both options on one keyboard.

If you use a `Key` that's just a string, the Keyboard will infer how capitalization should work by using [`String.prototype.toLocaleUppercase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase).

If a `KeyObject` with a callback `cb` is pressed while in shift mode, the keyboard returns to lowercase mode.

### How styling works

Any extra props passed to `VkbReactKeyboard` are spread on the parent `<div>` being returned. Use this to target your styles by passing `className`, or use a CSS-in-JS library to style the component.

### Accessibility

For labelling, the `ariaLabel` prop can be used to assign an [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label) directly. The `ariaLabelledBy` prop can be used to point to a label outside of the component using [aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby).

The `ariaRole` prop defaults to [`"region"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/region_role) and can be overwritten as you wish.

Pass other accessibility props as needed and they will be spread to the parent `<div>`.

## Development

Each supported front-end framework gets its own directory in `src`. The barrel files in `dist` are written by hand and will export all the individual components and common types. The `dist` folder gets checked into the repo with these barrel files, and they are not touched by the `clean` script for this reason.

## License

See [LICENSE](LICENSE).

## Support

If this library is useful to you, please consider giving to [Canadians for Justice and Peace in the Middle East](https://www.cjpme.org/).

Free Palestine from the river to the sea. 🇵🇸
