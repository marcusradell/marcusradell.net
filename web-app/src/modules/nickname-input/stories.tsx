import { storiesOf } from "@storybook/react";
import { createTheme } from "../../theme";
import { createNicknameInput } from ".";
import React from "react";

const theme = createTheme();

const input = createNicknameInput(theme);

storiesOf("Nickname input", module).add("Default", () => (
  <>
    <div style={{ margin: "15px" }}>
      <input.view />
    </div>
  </>
));
