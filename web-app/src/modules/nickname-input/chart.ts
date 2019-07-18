import { createAction } from "rx-machine";
import { EditingStore, EditReducer, Store, Chart, Actions } from "./types";

const initialStore: EditingStore = {
  state: "editing",
  value: ""
};

const chart: Chart = {
  editing: ["edit"]
};

const editReducer: EditReducer = (s: Store, value: string) => ({
  ...s,
  value
});

const actions: Actions = {
  edit: createAction(editReducer)
};

export const createChart = () => {
  return {
    chart,
    initialStore,
    actions
  };
};
