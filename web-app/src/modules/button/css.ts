import { css } from "@emotion/core";
import { Color, Theme } from "../../theme";

const colorScalar = 60;
const backgroundColorScalar = 60;

export function createCss(theme: Theme, color: Color) {
  return css({
    padding: "0 10px",
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
}
