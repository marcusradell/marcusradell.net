import { MachineStates, State, Reducers } from "./types";

export const initialState: State = {
  machine: MachineStates.Disabled
};

const validate = (valid: boolean) => (s: State) => ({
  machine: valid ? MachineStates.Enabled : MachineStates.Disabled
});

export const reducers: Reducers = {
  [MachineStates.Disabled]: {
    validate
  },
  [MachineStates.Enabled]: {
    submit: () => (s: State) => ({ machine: MachineStates.Submitting }),
    validate
  },
  [MachineStates.Submitting]: {
    done: () => (s: State) => ({ machine: MachineStates.Disabled })
  }
};
