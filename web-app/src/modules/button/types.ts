import { CreateAction } from "rx-machine";

export type Chart = {
  enabled: ["disable"];
  disabled: ["enable"];
};

export type EnabledStore = {
  state: "enabled";
};

export type DisabledStore = {
  state: "disabled";
};

export type Store = EnabledStore | DisabledStore;

export type DisableReducer = (s: Store) => DisabledStore;

export type EnableReducer = (s: Store) => EnabledStore;

export type Actions = {
  enable: CreateAction<EnableReducer>;
  disable: CreateAction<DisableReducer>;
};
