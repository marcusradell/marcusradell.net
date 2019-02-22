export type MachineState = "initial" | "editing";

export type State = {
  machine: MachineState;
  data: string;
};
