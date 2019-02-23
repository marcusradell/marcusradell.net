import { State, Reducers } from "./types";

export const initialState: State = {
  machine: "initial",
  data: ""
};

export const machineReducers: Reducers = {
  initial: {
    edit: (data: string) => (s: State) => ({
      ...s,
      machine: "editing",
      data
    }),
    disable: () => (s: State) => ({ ...s, machine: "disabled" })
  },
  editing: {
    edit: (data: string) => (s: State) => ({
      ...s,
      data
    }),
    disable: () => (s: State) => ({ ...s, machine: "disabled" })
  },
  disabled: {
    enable: () => (s: State) => ({ ...s, machine: "editing" })
  }
};
