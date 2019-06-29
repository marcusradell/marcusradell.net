import { storiesOf } from "@storybook/react";
import { createTheme } from "../../theme";
import { createButton } from ".";
import React from "react";

// Bugfix: Needed to be toggled off or on depending on if CRA or storybook is running.
window.React = React;

const theme = createTheme();

const primaryButton = createButton(theme, "primary", "primary");
const secondaryButton = createButton(theme, "secondary", "secondary");
const complementButton = createButton(theme, "complement", "complement");
const secondaryComplementButton = createButton(
  theme,
  "secondaryComplement",
  "secondaryComplement"
);

storiesOf("Button", module).add("Default", () => (
  <>
    <div style={{ margin: "15px" }}>
      <primaryButton.view />
    </div>
    <div style={{ margin: "15px" }}>
      <secondaryButton.view />
    </div>
    <div style={{ margin: "15px" }}>
      <complementButton.view />
    </div>
    <div style={{ margin: "15px" }}>
      <secondaryComplementButton.view />
    </div>
  </>
));
