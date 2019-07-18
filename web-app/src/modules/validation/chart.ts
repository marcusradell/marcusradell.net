import { createAction } from "rx-machine";
import {
  Chart,
  ValidateReducer,
  Store,
  Actions,
  Predicate,
  InitialStore
} from "./types";

const initialStore: InitialStore = {
  state: "initial"
};

const chart: Chart = {
  initial: ["validate"],
  invalid: ["validate"],
  valid: ["validate"]
};

export const createChart = (predicate: Predicate) => {
  const validateReducer: ValidateReducer = (s: Store, value: string) =>
    predicate(value) ? { state: "valid" } : { state: "invalid" };

  const actions: Actions = {
    validate: createAction(validateReducer)
  };

  return {
    initialStore,
    actions,
    chart
  };
};
