import { Rxm } from "../../rx-machine";

export type Store =
  | { state: "initial"; ctx: null }
  | { state: "valid"; ctx: null }
  | {
      state: "invalid";
      ctx: string;
    };

export type Chart<InputStore> = {
  initial: {
    validate(store: Store, inputStore: InputStore): Store;
  };
  valid: {
    validate(store: Store, inputStore: InputStore): Store;
  };
  invalid: {
    validate(store: Store, inputStore: InputStore): Store;
  };
};

export type Predicate<InputStore> = (s: InputStore) => boolean;

export type ErrorMessage<InputStore> = (s: InputStore) => string;

export type ViewStore<InputStore> = {
  self: Store;
  input: InputStore | null;
};

export type ValidationModule<InputStore> = {
  rxm: Rxm<Store, Chart<InputStore>>;
  createView(): () => JSX.Element;
};
