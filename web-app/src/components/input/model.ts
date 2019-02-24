import { State, Reducers } from "./types";

export const initialState: State = {
  machine: "initial",
  data: ""
};

export const machineReducers: Reducers = {
  initial: {
    edit: (data: string) => (s: State) => ({
      ...s,
      data
    })
  }
};
