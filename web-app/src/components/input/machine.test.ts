import { machine } from "./machine";

test("machine", () => {
  const m = machine({
    foo: {
      bar: (v: string) => (s: { v: string }) => ({ v })
    }
  });

  expect(Object.keys(m.foo.bar)).toEqual(["trigger", "stream", "updater"]);
});
