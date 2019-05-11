import { createRxm } from "../../rx-machine";
import React, { useEffect, useState } from "react";
import { createModel } from "./model";
import {
  ViewStore,
  Predicate,
  ErrorMessage,
  ValidationModule,
  Chart,
  Store
} from "./types";
import { Observable } from "rxjs";
import { Store as InputStore } from "../input/component";
import { tap, withLatestFrom, skip } from "rxjs/operators";
export * from "./types";

export function createValidationModule(
  predicate: Predicate<InputStore>,
  errorMessage: ErrorMessage<InputStore>,
  inputStateStream: Observable<InputStore>
): ValidationModule {
  const { chart, initialStore } = createModel<InputStore>(
    predicate,
    errorMessage
  );
  const [store, machine] = createRxm<Chart<InputStore>, Store>(
    chart,
    initialStore
  );

  return {
    createView() {
      return () => {
        const [viewStore, setViewStore] = useState<ViewStore<InputStore>>({
          self: initialStore,
          input: null
        });

        useEffect(() => {
          const validatorSubscription = inputStateStream
            .pipe(
              skip(1),
              withLatestFrom(store, (inputState, store) => ({
                inputState,
                store
              })),
              tap(({ inputState, store }) => {
                machine[store.state].validate.trigger(inputState);
              })
            )
            .subscribe(() => {});

          const storeSubscription = store
            .pipe(
              withLatestFrom(inputStateStream, (self, input) => ({
                self,
                input
              }))
            )
            .subscribe(nextViewStore => {
              setViewStore(nextViewStore);
            });

          return () => {
            validatorSubscription.unsubscribe();
            storeSubscription.unsubscribe();
          };
        }, []);

        switch (viewStore.self.state) {
          case "initial":
            return <span>&nbsp;</span>;
          case "invalid":
            return <span className="text-warning">{viewStore.self.ctx}</span>;
          case "valid":
            return <span className="text-success">OK!</span>;
        }
      };
    }
  };
}
