import { createMachine } from "./machine";
import { State } from "./types";

const initialState: State = {
  machine: "initial",
  data: ""
};

const machineReducers = {
  initial: {
    edit: (s: string) => (state: State) => ({
      ...state,
      machine: "editing",
      data: s
    })
  },
  editing: {
    edit: (s: string) => (state: State) => ({
      ...state,
      data: s
    })
  }
};

const [machine, machineState] = createMachine(machineReducers, initialState);

machineState
  .forEach(state => {
    console.log({ state });
  })
  .then(() => console.error("Unexpectedly completed the stream."))
  .catch(error => console.error(error));

machine.initial.actions.edit.trigger("Hello world!");
