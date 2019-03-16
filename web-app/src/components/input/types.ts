export enum MachineState {
  Initial = "initial"
}

export type State = {
  machine: MachineState;
  data: string;
};

export type Reducers = {
  initial: {
    edit: (data: string) => (state: State) => State;
  };
};
