import { storiesOf } from "@storybook/react";
import { createTheme } from "../../theme";
import { createSecretKeyInput } from ".";
import React from "react";

const theme = createTheme();

const secretKeyInput = createSecretKeyInput(theme);

storiesOf("Inputs - Secret key", module).add("Default", () => (
  <>
    <div style={{ margin: "15px" }}>
      <secretKeyInput.view />
    </div>
  </>
));
