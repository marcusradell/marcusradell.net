import { storiesOf } from "@storybook/react";
import { createTheme } from "../../theme";
import { createNicknameInput } from ".";
import React from "react";

// Bugfix: Needed to be toggled off or on depending on if CRA or storybook is running.
window.React = React;

const theme = createTheme();

const nicknameInput = createNicknameInput(theme);

storiesOf("Inputs - Nickname", module).add("Default", () => (
  <>
    <div style={{ margin: "15px" }}>
      <nicknameInput.view />
    </div>
  </>
));
