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
import { tap, withLatestFrom, skip } from "rxjs/operators";
export * from "./types";

export function createValidationModule<InputStore>(
  predicate: Predicate<InputStore>,
  errorMessage: ErrorMessage<InputStore>,
  inputStore: Observable<InputStore>
): ValidationModule<InputStore> {
  const { chart, initialStore } = createModel<InputStore>(
    predicate,
    errorMessage
  );
  const rxm = createRxm<Store, Chart<InputStore>>(chart, initialStore);

  return {
    rxm,
    createView() {
      return () => {
        const [viewStore, setViewStore] = useState<ViewStore<InputStore>>({
          self: initialStore,
          input: null
        });

        useEffect(() => {
          const validatorSubscription = inputStore
            .pipe(
              skip(1),
              withLatestFrom(rxm.store, (inputState, store) => ({
                inputState,
                store
              })),
              tap(({ inputState, store }) => {
                rxm.machine[store.state].validate.trigger(inputState);
              })
            )
            .subscribe(() => {});

          const storeSubscription = rxm.store
            .pipe(
              withLatestFrom(inputStore, (self, input) => ({
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
