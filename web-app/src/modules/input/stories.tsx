import { storiesOf } from "@storybook/react";
import { createTheme } from "../../theme";
import { createInput } from ".";
import React from "react";

const theme = createTheme();

const input = createInput(theme);

storiesOf("Input", module).add("Default", () => (
  <>
    <div style={{ margin: "15px" }}>
      <input.view />
    </div>
  </>
));
