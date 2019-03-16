import {
  State,
  MachineStates,
  Reducers,
  Predicate,
  ErrorMessage
} from "./types";

export const initialState: State = {
  machine: MachineStates.Initial,
  data: ""
};

export function createReducers<InputState>(
  predicate: Predicate<InputState>,
  errorMessage: ErrorMessage<InputState>
) {
  const validate = (inputState: InputState) => (s: State) => ({
    ...s,
    machine: predicate(inputState)
      ? MachineStates.Valid
      : MachineStates.Invalid,
    data: predicate(inputState) ? s.data : errorMessage(inputState)
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
