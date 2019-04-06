import { createMachine, Reducer } from "./index";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";

type Store = {
  // TODO: Fix so it works with unioned string literals.
  // state: "initial" | "ended";
  state: string;
};

test("createMachine", async () => {
  const configuration = {
    initial: {
      end: (s: Store, data: string) => ({
        state: "ended",
        data
      })
    },
    ended: {
      restart: (s: Store, data: number) => ({
        state: "initial",
        data
      })
    }
  };

  const initialState = {
    state: "initial"
  };

  const { machine, store } = createMachine(configuration, initialState);

  const result = await store.pipe(take(1)).toPromise();

  machine.ended.restart.trigger(1);

  expect(result).toEqual(2);
});
