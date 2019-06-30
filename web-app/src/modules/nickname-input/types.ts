export type State = "enabled" | "disabled";

export type Store = {
  state: State;
  data: string;
};

export type Chart = {
  disabled: {
    enable: (s: Store) => Store;
  };
  enabled: {
    setNickname: (s: Store, data: string) => Store;
    disable: (s: Store) => Store;
  };
};
