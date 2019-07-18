import { createAction } from "rx-machine";
import { EditReducer, Store, Chart, Actions, InitialStore } from "./types";
import { Predicate } from "../validation/types";

const initialStore: InitialStore = {
  state: "initial",
  value: ""
};

const chart: Chart = {
  initial: ["edit"],
  invalid: ["edit"],
  valid: ["edit"]
};

export const createChart = (predicate: Predicate) => {
  const editReducer: EditReducer = (s: Store, value: string) =>
    predicate(value) ? { state: "valid", value } : { state: "invalid", value };

  const actions: Actions = {
    edit: createAction(editReducer)
  };

  return {
    initialStore,
    actions,
    chart
  };
};
