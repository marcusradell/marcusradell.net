import * as React from "react";
import { Observable } from "rxjs";
import { useState, useEffect } from "react";
import { createRxm, Rxm } from "../../rx-machine";
import { Store, Chart } from "./types";
import { initialState, chart } from "./model";

export class SubmitButtonComponent {
  public rxm: Rxm<Store, Chart>;
  private enabledStream: Observable<boolean>;

  constructor(enabledStream: Observable<boolean>) {
    this.rxm = createRxm<Store, Chart>(chart, initialState);
    this.enabledStream = enabledStream;
  }

  public createView() {
    return () => {
      const [store, setStore] = useState(initialState);

      useEffect(() => {
        const subscription = this.rxm.store.subscribe(store => {
          setStore(store);
        });

        const validSubscription = this.enabledStream.subscribe(valid => {
          if (store.state === "submitting") {
            return;
          }

          this.rxm.machine[store.state].setEnabled.trigger(valid);
        });

        return () => {
          subscription.unsubscribe();
          validSubscription.unsubscribe();
        };
      }, []);

      return (
        <button
          className={
            "btn btn-large " +
            (store.state !== "enabled" ? "btn-outline-success" : "btn-success")
          }
          disabled={store.state !== "enabled"}
          onClick={e => this.onClick(store.state, e)}
        >
          {store.state === "submitting" ? "Submitting" : "Submit"}
        </button>
      );
    };
  }

  private onClick(
    state: Store["state"],
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) {
    e.preventDefault();

    if (state !== "enabled") {
      throw new Error(`Cannot submit from state <${state}>.`);
    }

    this.rxm.machine[state].submit.trigger();
  }
}
