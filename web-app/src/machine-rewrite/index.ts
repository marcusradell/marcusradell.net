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
  const currentTransitionsStream = doTransitionSubject.pipe<any, any>(
    startWith(updaters[initialStore.state]),
    switchMap(stream => stream)
  );

  const store: Observable<Store> = currentTransitionsStream.pipe(
    startWith(initialStore),
    scan<(s: Store) => Store, Store>((state, updater) => updater(state)),
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
  Configuration extends {
    [k: string]: { [k: string]: Reducer<Store, any> };
  }
>(configuration: Configuration, initialStore: Store) {
  const keys = Object.keys(configuration) as Array<keyof Configuration>;
  const machine = keys.reduce(
    (acc, key) => {
      const endpoints = createEndpoints(configuration[key]);
      acc[key] = endpoints;
      return acc;
    },
    {} as {
      [k in keyof Configuration]: {
        [kk in keyof Configuration[k]]: Endpoint<
          ReducerArgs<Configuration[k][kk]>[0],
          ReducerArgs<Configuration[k][kk]>[1]
        >
      }
    }
  );

  const store = createStore(machine, initialStore);

  return { machine, store };
}
