import { Theme } from "../../theme";

import { css } from "@emotion/core";

const colorScalar = 100;
const backgroundColorScalar = 0;

export const createCss = (theme: Theme) => {
  return css({
    padding: "0 10px",
    border: "0px solid",
    borderRadius: "5px",
    font: "inherit",
    fontFamily: "Helvetica",
    color: theme.colors.black(colorScalar),
    backgroundColor: theme.colors.black(backgroundColorScalar),
    cursor: "pointer",
    height: "50px",
    fontSize: "24px",
    width: "100%",
    transition: ".2s ease-in-out",
    transitionProperty: "color background-color",
    boxShadow: "0 8px 6px -6px black",
    "&:active": {
      color: theme.colors.black(colorScalar + 20),
      backgroundColor: theme.colors.black(backgroundColorScalar + 20),
      boxShadow: "0 4px 3px -3px black"
    },
    "&:disabled": {
      cursor: "not-allowed",
      color: theme.colors.black(colorScalar - 20),
      backgroundColor: theme.colors.black(20),
      boxShadow: "0 0px 0px -0px black"
    }
  });
};
