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

      this.machine[machineState].actions.edit.trigger(value);
    };
  }

  public createView() {
    return () => {
      const [state, setState] = useState(initialState);

      useEffect(() => {
        const subscription = this.machineState.subscribe(x => {
          setState(x);
          console.log(x);
        });

        return () => subscription.unsubscribe();
      }, []);

      return (
        <input
          className="form-control"
          type="text"
          value={state.data}
          onChange={this.onChange(state.machine)}
        />
      );
    };
  }
}
