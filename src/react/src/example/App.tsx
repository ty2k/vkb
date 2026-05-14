import { useState } from "react";

import { Keyboard } from "../lib/Keyboard";
import type { Key } from "../lib/types";

// import { Keyboard, type Key } from "../../dist";

import "./App.css";

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
      <div>
        <p>
          <span>Input:</span> {text}
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
        handlePress={(key) => handleKeyPress(key)}
        shiftOrCapsDoublePressMilliseconds={200}
      />
    </>
  );
}

export default App;
