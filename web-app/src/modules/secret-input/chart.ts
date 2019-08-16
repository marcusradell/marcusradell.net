import {
  Store,
  Chart,
  EmptyStore,
  GenerateReducer,
  DownloadReducer,
  Actions,
  HideReducer,
  ViewReducer
} from "./types";
import { createAction } from "rx-machine";

const initialStore: EmptyStore = {
  state: "empty",
  data: ""
};

// TODO: Make async
// TODO: Remove hardcoded password :-)
const generate: GenerateReducer = s => ({
  ...s,
  state: "hidden",
  data: "password123"
});

// TODO: Should this be async as well?
const download: DownloadReducer = (s, effect) => {
  effect();
  return {
    ...s
  };
};

const hide: HideReducer = s => ({
  ...s,
  state: "hidden"
});

const view: ViewReducer = s => ({
  ...s,
  state: "visible"
});

const chart: Chart = {
  empty: ["generate"],
  hidden: ["generate", "download", "view"],
  visible: ["generate", "download", "hide"]
};

const actions: Actions = {
  download: createAction(download),
  generate: createAction(generate),
  hide: createAction(hide),
  view: createAction(view)
};

export function createChart() {
  return {
    initialStore,
    chart,
    actions
  };
}
