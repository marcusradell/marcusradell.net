import { storiesOf } from "@storybook/react";

import { createValidation } from ".";
import React from "react";

const validation = createValidation(
  (s: string) => Boolean(s),
  "Field is required."
);

storiesOf("Validation", module).add("Default", () => (
  <>
    <div style={{ margin: "15px" }}>
      <validation.view />
    </div>
  </>
));
