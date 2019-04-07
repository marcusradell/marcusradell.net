import { Store } from "./types";

export const initialState: Store = {
  state: "editing",
  ctx: ""
};

export const reducers = {
  editing: {
    edit: (s: Store, ctx: string) => ({
      ...s,
      ctx
    })
  }
};
