import { CreateAction } from "rx-machine";

export type InitialStore = {
  state: "initial";
  value: string;
};

export type ValidStore = {
  state: "valid";
  value: string;
};

export type InvalidStore = {
  state: "invalid";
  value: string;
};

export type Store = InitialStore | ValidStore | InvalidStore;

export type EditReducer = (
  s: Store,
  value: string
) => ValidStore | InvalidStore;

export type Actions = {
  edit: CreateAction<EditReducer>;
};

export type Chart = {
  initial: ["edit"];
  valid: ["edit"];
  invalid: ["edit"];
};

export type Predicate = (value: string) => boolean;
