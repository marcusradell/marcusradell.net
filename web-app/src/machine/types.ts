import { Observable } from "rxjs";

export type ReducerArgs<
  T extends (store: any, action: any) => any
> = T extends (store: infer S, action: infer A) => typeof store
  ? [S, A]
  : never;

export type Reducer<Store, Action> = (s: Store, a: Action) => Store;

// export type EndpointArgs<
//   T extends {
//     trigger: (a: any) => void;
//     updater: Observable<(s: any) => typeof s>;
//   }
// > = T extends {
//   trigger: (a: infer A) => void;
//   updater: Observable<(s: infer S) => typeof s>;
// }
//   ? [S, A]
//   : never;

export type Endpoint<Store, Action> = {
  trigger: (a: Action) => void;
  updater: Observable<(s: Store) => Store>;
};
