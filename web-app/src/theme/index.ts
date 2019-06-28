import { colors, Colors } from "./colors";
export * from "./colors";

export type Theme = {
  colors: Colors;
};

export function createTheme(): Theme {
  return {
    colors
  };
}
