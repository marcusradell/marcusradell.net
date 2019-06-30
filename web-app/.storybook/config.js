import { configure } from "@storybook/react";
import React from "react";

window.React = React;

const req = require.context("../src/modules", true, /stories\.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
