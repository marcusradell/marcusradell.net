import { createMachine } from ".";
import { take, reduce } from "rxjs/operators";

type State = {
  machine: "initial" | "edit";
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
    };
    edit: {
      setValue: (data: string) => (s: State) => State;
      resetValue: () => (s: State) => State;
    };
  };

  const initialState: State = { machine: "initial", data: "" };

  const machineReducers: MachineReducers = {
    initial: {
      setValue: (data: string) => (s: State) => ({
        ...s,
        data,
        machine: "edit"
      })
    },
    edit: {
      setValue: (data: string) => (s: State) => ({ ...s, data }),
      resetValue: () => (s: State) => ({ ...s, data: "" })
    }
  };

  const [machine, machineState] = createMachine<State, MachineReducers>(
    machineReducers,
    initialState
  );

  const r = machineState
    .pipe(
      take(4),
      reduce<any, any[]>((acc, val) => {
        acc.push(val);
        return acc;
      }, [])
    )
    .forEach(state => {
      expect(state).toEqual([
        { data: "", machine: "initial" },
        { data: "abc", machine: "edit" },
        { data: "123", machine: "edit" },
        { data: "", machine: "edit" }
      ]);
    });

  machine.initial.actions.setValue.trigger("abc");
  machine.edit.actions.setValue.trigger("123");
  machine.edit.actions.resetValue.trigger(null);

  return r;
});
