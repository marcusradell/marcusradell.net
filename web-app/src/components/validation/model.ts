import { Store, Predicate, ErrorMessage } from "./types";

export const initialStore: Store = {
  state: "initial",
  data: ""
};

export function createReducers<InputState>(
  predicate: Predicate<InputState>,
  errorMessage: ErrorMessage<InputState>
) {
  function validate(s: Store, inputState: InputState): Store {
    return {
      ...s,
      state: predicate(inputState) ? "valid" : "invalid",
      data: predicate(inputState) ? s.data : errorMessage(inputState)
    };
  }

  const reducers = {
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
