import { createMachine } from ".";
import { take, skip } from "rxjs/operators";

type State = {
  machine: "initial";
  data: string;
};

test("machine trigger and stream", () => {
  type MachineReducers = {
    initial: {
      setValue: (data: string) => (s: State) => State;
    };
  };

  const initialState: State = { machine: "initial", data: "" };
  const machineReducers: MachineReducers = {
    initial: {
      setValue: (data: string) => (s: State) => ({ ...s, data })
    }
  };
  const [m] = createMachine<State, MachineReducers>(
    machineReducers,
    initialState
  );
  const r = m.initial.actions.setValue.stream.pipe(take(1)).forEach(x => {
    expect(x).toEqual("abc");
  });
  m.initial.actions.setValue.trigger("abc");
  return r;
});

test("machine action updater", () => {
  type MachineReducers = {
    initial: {
      setValue: (data: string) => (s: State) => State;
      resetValue: () => (s: State) => State;
    };
  };

  const initialState: State = { machine: "initial", data: "" };
  const machineReducers: MachineReducers = {
    initial: {
      setValue: (data: string) => (s: State) => ({ ...s, data }),
      resetValue: () => (s: State) => ({ ...s, data: "" })
    }
  };
  const [m] = createMachine<State, MachineReducers>(
    machineReducers,
    initialState
  );

  const r = m.initial.updater
    .pipe(
      skip(1),
      take(1)
    )
    .forEach(updater => {
      expect(updater({ data: "" })).toEqual({ data: "abc" });
    });

  m.initial.actions.resetValue.trigger(null);
  m.initial.actions.setValue.trigger("abc");

  return r;
});
