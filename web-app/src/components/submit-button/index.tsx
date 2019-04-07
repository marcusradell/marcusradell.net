import * as React from "react";
import { Observable, combineLatest } from "rxjs";
import { useState, useEffect } from "react";
import { createMachine, Machine } from "../../old_machine";
import { State, Reducers, MachineStates } from "./types";
import { initialState, reducers } from "./model";
import { ValidationComponent } from "../validation";
import { map, tap } from "rxjs/operators";
import { MachineStates as ValidationMachineStates } from "../validation";

export class SubmitButtonComponent {
  public machine: Machine<State, Reducers>;
  public stateStream: Observable<State>;
  private validStream: Observable<boolean>;

  constructor(validationComponents: ValidationComponent[]) {
    const [machine, stateStream] = createMachine<State, Reducers>(
      reducers,
      initialState
    );
    this.machine = machine;
    this.stateStream = stateStream;

    this.validStream = combineLatest(
      validationComponents.map(c => c.stateStream)
    ).pipe(
      map(states =>
        states.every(s => s.machine === ValidationMachineStates.Valid)
      )
    );
  }

  public createView() {
    return () => {
      const [state, setState] = useState(initialState);

      useEffect(() => {
        const subscription = this.stateStream.subscribe(state => {
          setState(state);
        });

        const validSubscription = this.validStream.subscribe(valid => {
          if (state.machine === MachineStates.Submitting) {
            return;
          }

          this.machine[state.machine].actions.validate.trigger(valid);
        });

        return () => {
          subscription.unsubscribe();
          validSubscription.unsubscribe();
        };
      }, [state.machine]);

      return (
        <button
          className={
            "btn btn-large " +
            (state.machine !== MachineStates.Enabled
              ? "btn-outline-success"
              : "btn-success")
          }
          disabled={state.machine !== MachineStates.Enabled}
          onClick={e => this.onClick(state.machine, e)}
        >
          {state.machine === MachineStates.Submitting ? "Submitting" : "Submit"}
        </button>
      );
    };
  }

  private onClick(
    machineState: MachineStates,
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) {
    e.preventDefault();

    if (machineState !== MachineStates.Enabled) {
      throw new Error(`Cannot submit from state <${machineState}>.`);
    }

    this.machine[machineState].actions.submit.trigger(null);
  }
}
