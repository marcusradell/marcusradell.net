import { Subject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";

type Updater<S> = (state: S) => S;

type Reducer<E, S> = (event: E) => Updater<S>;

// TODO: Get rid of the any type.
type Reducers<S> = { [s: string]: Reducer<any, S> };

type Trigger<E> = (x: E) => void;

type MachineNodeAction<E, S> = {
  trigger: Trigger<E>;
  stream: Observable<E>;
  updater: Observable<Updater<S>>;
};

function machineNodeAction<E, S>(
  reducer: Reducer<E, S>
): MachineNodeAction<E, S> {
  const subject = new Subject<E>();

  function trigger(x: E) {
    subject.next(x);
  }

  const stream = subject.asObservable();
  const updater = subject.pipe(map<E, Updater<S>>((x: E) => reducer(x)));

  const result: MachineNodeAction<E, S> = { trigger, stream, updater };

  return result;
}

type MachineReducers<S> = {
  [s: string]: Reducers<S>;
};

type MachineNode<S> = {
  actions: {
    [s: string]: MachineNodeAction<any, S>;
  };
  updater: Observable<any>;
};

type Machine = {
  [s: string]: MachineNode<any>;
};

function machineNodeUpdater<S>(mn: MachineNode<S>): Observable<Updater<S>> {
  return merge(...Object.values(mn.actions).map(x => x.updater));
}

function machineNode<S>(reducers: Reducers<S>): MachineNode<S> {
  let result: MachineNode<S> = Object.keys(reducers).reduce(
    (mn: MachineNode<S>, k: string) => {
      mn.actions[k] = machineNodeAction(reducers[k]);
      return mn;
    },
    { actions: {} } as MachineNode<S>
  );

  result.updater = machineNodeUpdater<S>(result);

  return result;
}

export function machine(machineReducers: MachineReducers<any>): Machine {
  const machine: Machine = Object.keys(machineReducers).reduce(
    (m: Machine, k: string) => {
      const reducers = machineReducers[k];
      m[k] = machineNode(reducers);
      return m;
    },
    {} as Machine
  );

  return machine;
}
