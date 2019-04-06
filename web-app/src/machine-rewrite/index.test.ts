import { createMachine, Reducer } from "./index";
import { skip, take } from "rxjs/operators";

test("createMachine", async () => {
  const chart = {
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

  type Store = {
    // TODO: Fix so it works with unioned string literals.
    // state: keyof typeof configuration;
    state: string;
  };

  const initialState = {
    state: "initial"
  };

  const { machine, store } = createMachine(chart, initialState);

  const result = store
    .pipe(
      skip(1),
      take(1)
    )
    .toPromise();

  machine.initial.end.trigger("foo");

  expect(await result).toEqual({ state: "ended", data: "foo" });
});
