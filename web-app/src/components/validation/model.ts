import { State, MachineStates, Reducers, Predicate } from "./types";

export const initialState: State = {
  machine: MachineStates.Initial,
  data: ""
};

export function createReducers<InputState>(
  predicate: Predicate<InputState>,
  error: string
) {
  const validate = (inputState: InputState) => (s: State) => ({
    ...s,
    machine: (console.log("test", predicate(inputState)),
    predicate(inputState) ? MachineStates.Valid : MachineStates.Invalid),
    data: predicate(inputState) ? s.data : error
  });

  const reducers: Reducers = {
    initial: {
      validate
    },
    valid: {
      validate
    },
    invalid: {
      validate
    }
  };

  return reducers;
}
