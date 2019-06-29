/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useState, FunctionComponent } from "react";
import { Color, Theme } from "../../theme";
import { ButtonState } from "./types";
export * from "./types";

const colorScalar = 60;
const backgroundColorScalar = 60;

const style = (theme: Theme, color: Color) =>
  css({
    padding: "0 10",
    border: "0px solid",
    borderRadius: "5px",
    font: "inherit",
    fontFamily: "Helvetica",
    color: theme.colors.black(colorScalar),
    backgroundColor: theme.colors[color](backgroundColorScalar),
    cursor: "pointer",
    height: "50px",
    fontSize: "24px",
    width: "100%",
    transition: ".2s ease-in-out",
    transitionProperty: "color background-color",
    boxShadow: "0 8px 6px -6px black",
    "&:active": {
      color: theme.colors.black(colorScalar + 10),
      backgroundColor: theme.colors[color](backgroundColorScalar + 10),
      boxShadow: "0 4px 3px -3px black"
    },
    "&:disabled": {
      cursor: "not-allowed",
      color: theme.colors.black(colorScalar - 20),
      backgroundColor: theme.colors[color](backgroundColorScalar - 20),
      boxShadow: "0 0px 0px -0px black"
    }
  });

export function createButton(theme: Theme, color: Color, text: string) {
  const view: FunctionComponent = () => {
    const [state, setState] = useState<ButtonState>("enabled");

    return (
      <button
        disabled={state === "disabled" || color === "secondaryComplement"}
        css={style(theme, color)}
      >
        {text}
      </button>
    );
  };

  return {
    view
  };
}
