import { createMachine } from "../../machine";
import { State, MachineState } from "./types";
import { Reducers } from "./types";
import { initialState, reducers } from "./model";
import { Machine } from "../../machine/types";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Observable } from "rxjs";
export * from "./types";

export class InputComponent {
  public machine: Machine<State, Reducers>;
  public stateStream: Observable<State>;

  constructor() {
    const [machine, stateStream] = createMachine<State, Reducers>(
      reducers,
      initialState
    );

    this.machine = machine;
    this.stateStream = stateStream;
  }

  public onChange(machineState: MachineState) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      this.machine[machineState].actions.edit.trigger(value);
    };
  }

  public createView(type: "text" | "password") {
    return () => {
      const [state, setState] = useState(initialState);

      useEffect(() => {
        const subscription = this.stateStream.subscribe(x => {
          setState(x);
        });

        return () => subscription.unsubscribe();
      }, []);

      return (
        <input
          className="form-control form-control-lg"
          type={type}
          value={state.data}
          onChange={this.onChange(state.machine)}
        />
      );
    };
  }
}
