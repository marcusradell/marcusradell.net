export enum MachineStates {
  Disabled = "disabled",
  Enabled = "enabled",
  Submitting = "submitting"
}

export type State = {
  machine: MachineStates;
};

type Validate = (valid: boolean) => (s: State) => State;

export type Reducers = {
  [MachineStates.Disabled]: {
    validate: Validate;
  };
  [MachineStates.Enabled]: {
    submit: () => (s: State) => State;
    validate: Validate;
  };

  [MachineStates.Submitting]: {
    done: () => (s: State) => State;
  };
};
