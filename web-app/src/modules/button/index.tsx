/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useState, FunctionComponent } from "react";
import { Color, Theme } from "../../theme";
import { ButtonState } from "./types";
export * from "./types";

const style = (theme: Theme, color: Color) =>
  css({
    padding: "0 10",
    border: "0px solid",
    borderRadius: "5px",
    font: "inherit",
    fontFamily: "Helvetica",
    color: theme.colors.black(20),
    backgroundColor: theme.colors[color](60),
    cursor: "pointer",
    height: "50px",
    fontSize: "24px",
    width: "100%",
    transition: ".2s ease-in-out",
    transitionProperty: "color background-color",
    "&:active": {
      color: theme.colors.black(20 - 10),
      backgroundColor: theme.colors[color](60 - 10)
    },
    "&:disabled": {
      color: theme.colors.black(20 + 10),
      backgroundColor: theme.colors[color](60 + 20)
    }
  });

export function createButton(theme: Theme, color: Color, text: string) {
  const view: FunctionComponent = () => {
    const [state, setState] = useState<ButtonState>("enabled");

    return (
      <button disabled={state === "disabled"} css={style(theme, color)}>
        {text}
      </button>
    );
  };

  return {
    view
  };
}
