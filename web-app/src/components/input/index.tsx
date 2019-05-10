import {
  createValidationModule,
  Predicate,
  ErrorMessage,
  ValidationModule
} from "../validation";
import { createMachine } from "../../rx-machine";
import { Store } from "./types";
import { initialState, reducers } from "./model";
import React, { useEffect, useState, ChangeEvent } from "react";
export * from "./types";

export class InputComponent {
  public rxm = createMachine(reducers, initialState);
  public validationModule: ValidationModule;

  constructor(predicate: Predicate<Store>, errorMessage: ErrorMessage<Store>) {
    this.validationModule = createValidationModule(
      predicate,
      errorMessage,
      this.rxm.store
    );
  }

  public onChange(state: Store["state"]) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      this.rxm.machine[state].edit.trigger(value);
    };
  }

  public createView(type: "text" | "password") {
    const Validation = this.validationModule.createView();

    return () => {
      const [store, setState] = useState(initialState);

      useEffect(() => {
        const subscription = this.rxm.store.subscribe(x => {
          setState(x);
        });

        return () => subscription.unsubscribe();
      }, []);

      return (
        <>
          <input
            className="form-control form-control-lg"
            type={type}
            value={store.ctx}
            onChange={this.onChange(store.state)}
          />
          <div>
            <Validation />
          </div>
        </>
      );
    };
  }
}
