import { Observable } from "rxjs";

export type Updater<S> = (state: S) => S;

export type Reducer<E, S> = (event: E) => Updater<S>;

export type Reducers<S, A> = { [k in keyof A]: Reducer<any, S> };

export type Trigger<E> = (x: E) => void;

export type MachineNodeAction<E, S> = {
  trigger: Trigger<E>;
  stream: Observable<E>;
  updater: Observable<Updater<S>>;
};

export type MachineReducers<S, N> = { [k in keyof N]: Reducers<S, N[k]> };

export type MachineNode<S, A> = {
  actions: { [k in keyof A]: MachineNodeAction<any, S> };
  updater: Observable<any>;
};

export type Machine<S, N> = { [k in keyof N]: MachineNode<S, N[k]> };

export type MachineState<S> = any;
