export type ButtonState = "enabled" | "disabled";

export type ButtonStore = {
  state: ButtonState;
};

export type ButtonChart = {
  enabled: {
    disable: (s: ButtonStore) => ButtonStore;
  };
  disabled: {
    enable: (s: ButtonStore) => ButtonStore;
  };
};
