import { createStore, useStore } from "rx-machine";
import React, { useEffect, useState, FunctionComponent } from "react";
import { createChart } from "./chart";
import { Predicate, Chart, Store, Actions } from "./types";
import { tap, withLatestFrom, skip } from "rxjs/operators";
export * from "./types";

export const createValidation = (
  predicate: Predicate,
  errorMessage: string
) => {
  const { chart, initialStore, actions } = createChart(predicate);
  const storeStream = createStore<Chart, Store, Actions>(
    chart,
    initialStore,
    actions
  );

  const view: FunctionComponent = () => {
    const store = useStore<Store>(initialStore, storeStream);

    return <>{JSON.stringify(store)}</>;
  };

  return {
    storeStream,
    view
    // createView() {
    //   return () => {
    //     const [viewStore, setViewStore] = useState<ViewStore<InputStore>>({
    //       self: initialStore,
    //       input: null
    //     });

    //     useEffect(() => {
    //       const validatorSubscription = inputStore
    //         .pipe(
    //           skip(1),
    //           withLatestFrom(rxm.store, (inputState, store) => ({
    //             inputState,
    //             store
    //           })),
    //           tap(({ inputState, store }) => {
    //             rxm.machine[store.state].validate.trigger(inputState);
    //           })
    //         )
    //         .subscribe(() => {});

    //       const storeSubscription = rxm.store
    //         .pipe(
    //           withLatestFrom(inputStore, (self, input) => ({
    //             self,
    //             input
    //           }))
    //         )
    //         .subscribe(nextViewStore => {
    //           setViewStore(nextViewStore);
    //         });

    //       return () => {
    //         validatorSubscription.unsubscribe();
    //         storeSubscription.unsubscribe();
    //       };
    //     }, []);

    //     switch (viewStore.self.state) {
    //       case "initial":
    //         return <span>&nbsp;</span>;
    //       case "invalid":
    //         return <span className="text-warning">{viewStore.self.ctx}</span>;
    //       case "valid":
    //         return <span className="text-success">OK!</span>;
    //     }
    //   };
    // }
  };
};
