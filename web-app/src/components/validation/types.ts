import { Store as InputStore } from "../input/component";

export type Store = {
  state: "initial" | "valid" | "invalid";
  data: string;
};

export type Predicate<InputStore> = (s: InputStore) => boolean;

export type ErrorMessage<InputStore> = (s: InputStore) => string;

export type ViewState = {
  self: Store;
  input: InputStore | null;
};

export type ValidationModule = {
  createView(): () => JSX.Element;
};
