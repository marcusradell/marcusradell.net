import { CreateAction } from "rx-machine";

export type InitialStore = {
  state: "initial";
};

export type ValidStore = {
  state: "valid";
};

export type InvalidStore = {
  state: "invalid";
};

export type Store = InitialStore | ValidStore | InvalidStore;

export type ValidateReducer = (
  s: Store,
  value: string
) => ValidStore | InvalidStore;

export type Actions = {
  validate: CreateAction<ValidateReducer>;
};

export type Chart = {
  initial: ["validate"];
  valid: ["validate"];
  invalid: ["validate"];
};

export type Predicate = (value: string) => boolean;
