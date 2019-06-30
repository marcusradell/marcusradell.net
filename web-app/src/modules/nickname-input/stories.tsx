import { storiesOf } from "@storybook/react";
import { createTheme } from "../../theme";
import { createNicknameInput } from ".";
import React from "react";

const theme = createTheme();

const nicknameInput = createNicknameInput(theme);

storiesOf("Inputs - Nickname", module).add("Default", () => (
  <>
    <div style={{ margin: "15px" }}>
      <nicknameInput.view />
    </div>
  </>
));
