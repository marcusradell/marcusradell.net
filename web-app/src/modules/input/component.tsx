import {
  createValidationModule,
  Predicate,
  ErrorMessage,
  ValidationModule
} from "../validation";
import { createRxm, Rxm } from "../../rx-machine";
import { Store, Chart } from "./types";
import { initialStore, chart } from "./model";
import React, { useEffect, useState, ChangeEvent } from "react";
export * from "./types";

export class InputComponent {
  public rxm: Rxm<Store, Chart>;
  public validationModule: ValidationModule<Store>;

  constructor(
    predicate: Predicate<Store>,
    errorMessage: ErrorMessage<Store>,
    private type: "text" | "password"
  ) {
    this.rxm = createRxm<Store, Chart>(chart, initialStore);

    this.validationModule = createValidationModule(
      predicate,
      errorMessage,
      this.rxm.store
    );

    this.onChange = this.onChange.bind(this);
  }

  private onChange(e: ChangeEvent<HTMLInputElement>) {
    this.rxm.machine.editing.edit.trigger(e.target.value);
  }

  public createView() {
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
            type={this.type}
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
