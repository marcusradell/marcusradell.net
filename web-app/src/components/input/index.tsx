import { ValidationComponent, Predicate, ErrorMessage } from "../validation";
import { createMachine } from "../../machine";
import { Store } from "./types";
import { initialState, reducers } from "./model";
import React, { useEffect, useState, ChangeEvent } from "react";
export * from "./types";

export class InputComponent {
  public rxm = createMachine(reducers, initialState);
  public validationComponent: ValidationComponent;

  constructor(predicate: Predicate<Store>, errorMessage: ErrorMessage<Store>) {
    this.validationComponent = new ValidationComponent(
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
    const Validation = this.validationComponent.createView();

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
