import { Store, Chart } from "./types";

export const initialStore: Store = {
  state: "editing",
  ctx: ""
};

export const chart: Chart = {
  editing: {
    edit: (s: Store, ctx: string) => ({
      ...s,
      ctx
    })
  }
};
