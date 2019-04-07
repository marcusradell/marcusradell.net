import { Subject, merge, Observable } from "rxjs";
import {
  map,
  startWith,
  switchMap,
  scan,
  tap,
  shareReplay
} from "rxjs/operators";
import {
  Reducer,
  MachineNodeAction,
  Updater,
  Reducers,
  MachineReducers,
  MachineNode,
  Machine,
  MachineState
} from "./types";
export * from "./types";

function createMachineNodeAction<E, S>(
  reducer: Reducer<E, S>
): MachineNodeAction<E, S> {
  const subject = new Subject<E>();

  function trigger(x?: E) {
    subject.next(x);
  }

  const stream: Observable<E> = subject.asObservable();
  const updater: Observable<Updater<S>> = subject.pipe(
    map((x: E) => reducer(x))
  );

  const result: MachineNodeAction<E, S> = { trigger, stream, updater };
  return result;
}

function createUpdater<S, A>(mn: MachineNode<S, A>): Observable<Updater<S>> {
  return merge(
    ...Object.values<MachineNodeAction<any, S>>(mn.actions).map(x => x.updater)
  );
}

function createMachineNode<S, A>(reducers: Reducers<S, A>): MachineNode<S, A> {
  let result: MachineNode<S, A> = (Object.keys(reducers) as (keyof A)[]).reduce(
    (mn, k) => {
      mn.actions[k] = createMachineNodeAction(reducers[k]);
      return mn;
    },
    { actions: {} } as MachineNode<S, A>
  );

  result.updater = createUpdater<S, A>(result);

  return result;
}

function createMachineState<S, N>(
  machine: Machine<S, N>,
  initialState: S
): Observable<MachineState<S>> {
  // Will be triggered each time the state changes (should add distinctUntilChanged).
  const doTransitionSubject = new Subject<any>();

  // Start listen to all the state updaters in the machine's initial state.
  // Each time the machine state changes, we will switch to the current updater stream.
  const currentTransitionsStream = doTransitionSubject.pipe<any, any>(
    startWith((machine as any)[(initialState as any).machine].updater),
    switchMap(stream => stream)
  );

  const ms: Observable<MachineState<S>> = currentTransitionsStream.pipe(
    startWith(initialState),
    scan<Updater<S>, S>((state, updater) => updater(state)),
    tap(state =>
      doTransitionSubject.next((machine as any)[(state as any).machine].updater)
    ),
    shareReplay(1)
  );

  return ms;
}

export function createMachine<S, N>(
  machineReducers: MachineReducers<S, N>,
  initialState: S
): [Machine<S, N>, Observable<MachineState<S>>] {
  const machine: Machine<S, N> = Object.keys(machineReducers).reduce(
    (m, k) => {
      const nodeReducers = machineReducers[k as keyof N];
      m[k as keyof N] = createMachineNode<S, N[keyof N]>(nodeReducers);
      return m;
    },
    {} as Machine<S, N>
  );

  const machineState = createMachineState(machine, initialState);

  return [machine, machineState];
}
