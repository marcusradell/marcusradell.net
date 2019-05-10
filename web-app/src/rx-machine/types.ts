import { Observable } from "rxjs";

export type ReducerArgs<
  Reducer extends (store: any, action: any) => any
> = Reducer extends (store: infer Store, action: infer Action) => typeof store
  ? [Store, Action]
  : never;

export type Reducer<Store, Action> = (s: Store, a: Action) => Store;

export type Reducers<Obj> = { [k in keyof Obj]: Reducer<any, any> };

export type Endpoint<Store, Action> = {
  trigger: (a: Action) => void;
  updater: Observable<(s: Store) => Store>;
};

export type Rxm<
  Chart extends { [k: string]: { [k: string]: Reducer<Store, any> } },
  Store
> = {
  machine: {
    [k in keyof Chart]: {
      [kk in keyof Chart[k]]: Endpoint<
        ReducerArgs<Chart[k][kk]>[0],
        ReducerArgs<Chart[k][kk]>[1]
      >
    }
  };
  store: Observable<Store>;
};
