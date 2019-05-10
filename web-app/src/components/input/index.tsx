import {
  createValidationModule,
  Predicate,
  ErrorMessage,
  ValidationModule
} from "../validation";
import { createRxm, Endpoint, Rxm } from "../../rx-machine";
import { Store, Chart } from "./types";
import { initialStore, chart } from "./model";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Observable } from "rxjs";
export * from "./types";

export class InputComponent {
  public rxm: Rxm<Chart, Store>;
  public validationModule: ValidationModule;

  constructor(predicate: Predicate<Store>, errorMessage: ErrorMessage<Store>) {
    this.rxm = createRxm<Chart, Store>(chart, initialStore);

    this.validationModule = createValidationModule(
      predicate,
      errorMessage,
      this.rxm.store
    );
  }

  private onChange(e: ChangeEvent<HTMLInputElement>) {
    this.rxm.machine.editing.edit.trigger(e.target.value);
  }

  public createView(type: "text" | "password") {
    const Validation = this.validationModule.createView();

    return () => {
      const [store, setState] = useState(initialStore);

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
            onChange={this.onChange}
          />
          <div>
            <Validation />
          </div>
        </>
      );
    };
  }
}
