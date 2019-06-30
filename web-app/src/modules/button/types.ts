export type State = "enabled" | "disabled";

export type Store = {
  state: State;
};

export type Chart = {
  enabled: {
    disable: (s: Store) => Store;
  };
  disabled: {
    enable: (s: Store) => Store;
  };
};
