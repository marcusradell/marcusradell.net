export type MachineState = "initial" | "editing";

export type State = {
  machine: MachineState;
  data: string;
};

export type MachineReducers = {
  initial: {
    edit: (s: string) => (state: State) => State;
  };
  editing: {
    edit: (s: string) => (state: State) => State;
  };
};
