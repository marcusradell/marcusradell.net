import {
  EnabledStore,
  Chart,
  Actions,
  Store,
  DisableReducer,
  EnableReducer
} from "./types";
import { createAction } from "rx-machine";

const chart: Chart = {
  enabled: ["disable"],
  disabled: ["enable"]
};

const initialStore: EnabledStore = {
  state: "enabled"
};

const disableReducer: DisableReducer = (s: Store) => ({ state: "disabled" });
const enableReducer: EnableReducer = (s: Store) => ({ state: "enabled" });

export const actions: Actions = {
  disable: createAction(disableReducer),
  enable: createAction(enableReducer)
};

export const createChart = () => ({
  chart,
  initialStore,
  actions
});
