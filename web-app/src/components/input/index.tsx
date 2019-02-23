import { createMachine } from "../../machine";
import { State, MachineState } from "./types";
import { Reducers } from "./types";
import { initialState, machineReducers } from "./model";
import { Machine } from "../../machine/types";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Observable } from "rxjs";

export class InputComponent {
  machine: Machine<State, Reducers>;
  machineState: Observable<State>;

  constructor() {
    const [machine, machineState] = createMachine<State, Reducers>(
      machineReducers,
      initialState
    );

    this.machine = machine;
    this.machineState = machineState;
  }

  public onChange(machineState: MachineState) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (machineState === "disabled") {
        throw new Error("Cannot handle onChange while disabled.");
      }

      this.machine[machineState].actions.edit.trigger(value);
    };
  }

  public onClick(machineState: MachineState) {
    return () => {
      if (machineState === "disabled") {
        this.machine[machineState].actions.enable.trigger(null);
      } else {
        this.machine[machineState].actions.disable.trigger(null);
      }
    };
  }

  public getView() {
    return () => {
      const [state, setState] = useState(initialState);

      useEffect(() => {
        const subscription = this.machineState.subscribe(x => {
          setState(x);
        });

        return () => subscription.unsubscribe();
      }, []);

      return (
        <>
          <input
            disabled={state.machine === "disabled"}
            value={state.data}
            onChange={this.onChange(state.machine)}
          />
          <button onClick={this.onClick(state.machine)}>Toggle</button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      );
    };
  }
}
