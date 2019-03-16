import { createMachine } from "../../machine";
import React, { useEffect, useState } from "react";
import { createReducers, initialState } from "./model";
import { Machine } from "../../machine/types";
import { State, Reducers, ViewState, MachineStates } from "./types";
import { Observable } from "rxjs";
import { State as InputState } from "../input";
import { tap, withLatestFrom, skip } from "rxjs/operators";

export class ValidationComponent {
  public machine: Machine<State, Reducers>;
  public stateStream: Observable<State>;
  private inputStateStream: Observable<InputState>;

  constructor(inputStateStream: Observable<InputState>) {
    const [machine, machineState] = createMachine(
      createReducers<InputState>(
        inputState => Boolean(inputState.data),
        "Validation error."
      ),
      initialState
    );
    this.machine = machine;
    this.stateStream = machineState;
    this.inputStateStream = inputStateStream;
  }

  public createView() {
    return () => {
      const [state, setState] = useState<ViewState>({
        self: initialState,
        input: null
      });

      useEffect(() => {
        const validatorSubscription = this.inputStateStream
          .pipe(
            skip(1),
            withLatestFrom(this.stateStream, (inputState, state) => ({
              inputState,
              state
            })),
            tap(({ inputState, state }) => {
              this.machine[state.machine].actions.validate.trigger(inputState);
            })
          )
          .subscribe(() => {});

        const stateSubscription = this.stateStream
          .pipe(
            withLatestFrom(this.inputStateStream, (self, input) => ({
              self,
              input
            }))
          )
          .subscribe(viewState => {
            setState(viewState);
          });

        return () => {
          validatorSubscription.unsubscribe();
          stateSubscription.unsubscribe();
        };
      }, []);

      switch (state.self.machine) {
        case MachineStates.Initial:
          return null;
        case MachineStates.Invalid:
          return <span className="text-warning">{state.self.data}</span>;
        case MachineStates.Valid:
          return <span className="text-success">OK!</span>;
      }
    };
  }
}
