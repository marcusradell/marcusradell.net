import { Store, Chart } from "./types";

export const initialState: Store = {
  state: "disabled"
};

const setEnabled = (s: Store, enabled: boolean) =>
  ({
    state: enabled ? "enabled" : "disabled"
  } as const);

export const chart: Chart = {
  disabled: {
    setEnabled
  },
  enabled: {
    submit: (s: Store, _: null) => ({ state: "submitting" }),
    setEnabled
  },
  submitting: {
    done: (s: Store) => ({ state: "disabled" })
  }
};
