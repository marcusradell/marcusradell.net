export type Store = {
  state: "disabled" | "enabled" | "submitting";
};

type SetEnabled = (s: Store, enabled: boolean) => Store;

export type Chart = {
  disabled: {
    setEnabled: SetEnabled;
  };
  enabled: {
    submit: (s: Store) => Store;
    setEnabled: SetEnabled;
  };
  submitting: {
    done: (s: Store) => Store;
  };
};
