import { createRxm } from "../../rx-machine";
import React, { useEffect, useState } from "react";
import { createReducers, initialStore } from "./model";
import { ViewState, Predicate, ErrorMessage, ValidationModule } from "./types";
import { Observable } from "rxjs";
import { Store as InputStore } from "../input/component";
import { tap, withLatestFrom, skip } from "rxjs/operators";
export * from "./types";

export function createValidationModule(
  predicate: Predicate<InputStore>,
  errorMessage: ErrorMessage<InputStore>,
  inputStateStream: Observable<InputStore>
): ValidationModule {
  const rxm = createRxm(
    createReducers<InputStore>(predicate, errorMessage),
    initialStore
  );

  return {
    createView() {
      return () => {
        const [store, setState] = useState<ViewState>({
          self: initialStore,
          input: null
        });

        useEffect(() => {
          const validatorSubscription = inputStateStream
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
              withLatestFrom(inputStateStream, (self, input) => ({
                self,
                input
              }))
            )
            .subscribe(viewState => {
              setState(viewState);
            });

          return () => {
            validatorSubscription.unsubscribe();
            storeSubscription.unsubscribe();
          };
        }, []);

        switch (store.self.state) {
          case "initial":
            return <span>&nbsp;</span>;
          case "invalid":
            return <span className="text-warning">{store.self.data}</span>;
          case "valid":
            return <span className="text-success">OK!</span>;
        }
      };
    }
  };
}
