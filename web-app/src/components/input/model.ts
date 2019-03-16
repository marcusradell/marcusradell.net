import { State, Reducers, MachineState } from "./types";

export const initialState: State = {
  machine: MachineState.Initial,
  data: ""
};

export const reducers: Reducers = {
  initial: {
    edit: (data: string) => (s: State) => ({
      ...s,
      data
    })
  }
};
