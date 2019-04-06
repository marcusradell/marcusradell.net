import { Subject, merge, Observable } from "rxjs";
import {
  map,
  startWith,
  switchMap,
  scan,
  tap,
  shareReplay
} from "rxjs/operators";
import { Reducer, Endpoint, ReducerArgs } from "./types";
export * from "./types";

function createEndpoint<Store, Action>(reducer: Reducer<Store, Action>) {
  const subject = new Subject<Action>();

  function trigger(x: Action) {
    subject.next(x);
  }

  const updater: Observable<(s: Store) => Store> = subject.pipe(
    map((a: Action) => (s: Store) => reducer(s, a))
  );

  return { trigger, updater } as const;
}

function createEndpoints<Reducers extends { [k: string]: Reducer<any, any> }>(
  reducers: Reducers
) {
  const keys = Object.keys(reducers) as (keyof Reducers)[];

  const endpoints = keys.reduce(
    (acc, key) => {
      type Args = ReducerArgs<Reducers[typeof key]>;
      acc[key] = createEndpoint<Args[0], Args[1]>(reducers[key]);
      return acc;
    },
    {} as {
      [k in keyof Reducers]: {
        trigger: (a: ReducerArgs<Reducers[k]>[1]) => void;
        updater: Observable<
          (s: ReducerArgs<Reducers[k]>[0]) => ReducerArgs<Reducers[k]>[0]
        >;
      }
    }
  );

  return endpoints;
}

function createStore<
  Keys extends string,
  Endpoints extends { [k: string]: Endpoint<Store, any> },
  Machine extends { [k in Keys]: Endpoints },
  Store extends { state: Keys }
>(machine: Machine, initialStore: Store) {
  const keys = Object.keys(machine) as Array<keyof Machine>;
  const updaters = keys.reduce(
    (acc, key) => {
      const kkeys = Object.keys(machine[key]) as Array<
        keyof Machine[typeof key]
      >;
      const updater = merge(...kkeys.map(kkey => machine[key][kkey].updater));
      acc[key] = updater;
      return acc;
    },
    {} as { [k in keyof Machine]: Observable<(s: Store) => Store> }
  );

  // Will be triggered each time the state changes.
  // TODO: should add distinctUntilChanged).
  const doTransitionSubject = new Subject<any>();

  // Start listen to all the state updaters in the machine's initial state.
  // Each time the machine state changes, we will switch to the current updater stream.
  const currentTransitionsStream = doTransitionSubject.pipe(
    startWith<Observable<(s: Store) => Store>>(updaters[initialStore.state]),
    switchMap(stream => stream)
  );

  const store: Observable<Store> = currentTransitionsStream.pipe(
    startWith<any>(initialStore),
    scan<(s: Store) => Store, Store>((store, updater) => updater(store)),
    tap(store => {
      const currentState = store.state;
      doTransitionSubject.next(updaters[currentState]);
    }),
    shareReplay(1)
  );

  return store;
}

export function createMachine<
  Store extends { state: string },
  Chart extends {
    [k: string]: { [k: string]: Reducer<Store, any> };
  }
>(chart: Chart, initialStore: Store) {
  const keys = Object.keys(chart) as Array<keyof Chart>;
  const machine = keys.reduce(
    (acc, key) => {
      const endpoints = createEndpoints(chart[key]);
      acc[key] = endpoints;
      return acc;
    },
    {} as {
      [k in keyof Chart]: {
        [kk in keyof Chart[k]]: Endpoint<
          ReducerArgs<Chart[k][kk]>[0],
          ReducerArgs<Chart[k][kk]>[1]
        >
      }
    }
  );

  const store = createStore(machine, initialStore);

  return { machine, store };
}