import { State as InputState } from "../input";

export enum MachineStates {
  Initial = "initial",
  Valid = "valid",
  Invalid = "invalid"
}

export type State = {
  machine: MachineStates;
  data: string;
};

type Validate = (inputState: any) => (s: State) => State;

export type Reducers = {
  initial: { validate: (inputState: any) => (s: State) => State };
  valid: { validate: (inputState: any) => (s: State) => State };
  invalid: { validate: (inputState: any) => (s: State) => State };
};

export type Predicate<InputState> = (s: InputState) => boolean;

export type ViewState = {
  self: State;
  input: InputState | null;
};
