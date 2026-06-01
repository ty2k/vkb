import { useState } from "react";

import { Keyboard } from "../lib/Keyboard";
import type { Key } from "../lib/types";
import { useKeyboard } from "../lib/useKeyboard";

// Un-comment the `import` line below to test
// distributed code after running `npm run build`:
// -----------------------------------------------
// import { Keyboard, useKeyboard, type Key } from "../../dist";

import "./App.css";

function App() {
  const [text, setText] = useState("");

  function handleBackspace() {
    setText((prev) => prev.substring(0, prev.length - 1));
  }

  function handleClear() {
    setText("");
  }

  const keyboard = useKeyboard({
    handlePress: (key: Key) => {
      if (typeof key === "string") {
        setText((prev) => prev + key);
        return;
      }

      setText((prev) => prev + (key.v ?? key.k));
    },
    shiftOrCapsDoublePressMilliseconds: 200,
  });

  return (
    <>
      <div>
        <output>Input:</output> {text}
        <p aria-live="polite">
          <span>Keyboard mode:</span>{" "}
          {keyboard.isCapsLocked
            ? "Caps Lock On"
            : keyboard.isShifted
              ? "Shift On"
              : "Lowercase"}
        </p>
      </div>
      <Keyboard
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
        keyboardController={keyboard}
      />
    </>
  );
}

export default App;
