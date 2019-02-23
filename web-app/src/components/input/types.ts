export type MachineState = "initial" | "editing" | "disabled";

export type State = {
  machine: MachineState;
  data: string;
};

export type Reducers = {
  initial: {
    edit: (data: string) => (state: State) => State;
    disable: () => (s: State) => State;
  };
  editing: {
    edit: (data: string) => (state: State) => State;
    disable: () => (s: State) => State;
  };
  disabled: {
    enable: () => (s: State) => State;
  };
};
