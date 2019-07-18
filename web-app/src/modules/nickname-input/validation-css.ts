import { Theme } from "../../theme";
import { css } from "@emotion/core";

export function createValidationCss(theme: Theme) {
  return css({
    padding: "10px",
    fontSize: "18px",
    fontFamily: "Georgia",
    color: theme.colors.secondaryComplement(70)
  });
}
