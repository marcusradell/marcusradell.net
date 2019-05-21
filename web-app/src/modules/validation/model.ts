import { Store, Predicate, ErrorMessage, Chart } from "./types";

export function createModel<InputStore>(
  predicate: Predicate<InputStore>,
  errorMessage: ErrorMessage<InputStore>
) {
  function validate(store: Store, inputStore: InputStore): Store {
    const state = predicate(inputStore) ? "valid" : "invalid";

    if (state === "invalid") {
      const ctx = errorMessage(inputStore);

      return {
        ...store,
        state,
        ctx
      };
    }

    const ctx = null;

    return {
      ...store,
      state,
      ctx
    };
  }

  const initialStore: Store = {
    state: "initial",
    ctx: null
  };

  const chart: Chart<InputStore> = {
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

  return { initialStore, chart };
}
