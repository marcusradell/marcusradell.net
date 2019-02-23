import { createMachine } from "./machine";
import { take, skip } from "rxjs/operators";

test("machine trigger and stream", () => {
  const [m] = createMachine(
    {
      initial: {
        setValue: (v: string) => (s: { v: string }) => ({ v })
      }
    },
    { machine: "initial", data: "" }
  );
  const r = m.initial.actions.setValue.stream.pipe(take(1)).forEach(x => {
    expect(x).toEqual("abc");
  });
  m.initial.actions.setValue.trigger("abc");
  return r;
});

test("machine action updater", () => {
  const [m] = createMachine(
    {
      initial: {
        setValue: (v: string) => (s: { v: string }) => ({ v }),
        resetValue: () => (s: { v: string }) => ({ v: "" })
      }
    },
    { machine: "initial", data: "" }
  );

  const r = m.initial.updater
    .pipe(
      skip(1),
      take(1)
    )
    .forEach(x => {
      expect(x({ v: "" })).toEqual({ v: "abc" });
    });

  m.initial.actions.resetValue.trigger(null);
  m.initial.actions.setValue.trigger("abc");

  return r;
});
