import { CreateAction } from "rx-machine";

export type EmptyStore = {
  state: "empty";
  data: "";
};

export type HiddenStore = {
  state: "hidden";
  data: string;
};

export type VisibleStore = {
  state: "visible";
  data: string;
};

export type Store = EmptyStore | HiddenStore | VisibleStore;

export type Chart = {
  empty: ["generate"];
  hidden: ["generate", "download", "view"];
  visible: ["generate", "download", "hide"];
};

export type GenerateReducer = (s: Store) => HiddenStore;

export type DownloadReducer = (
  s: Store,
  effect: () => void
) => Store extends typeof s ? Store : never;

export type ViewReducer = (s: Store) => VisibleStore;

export type HideReducer = (s: Store) => HiddenStore;

export type Actions = {
  generate: CreateAction<GenerateReducer>;
  download: CreateAction<DownloadReducer>;
  view: CreateAction<ViewReducer>;
  hide: CreateAction<HideReducer>;
};
