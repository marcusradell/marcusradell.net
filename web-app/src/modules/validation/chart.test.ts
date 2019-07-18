import { createChart } from "./chart";

const isRequired = (s: string) => Boolean(s);
const { initialStore, actions } = createChart(isRequired);

test("createChart: validate reducer returns invalid state", () => {
  const result = actions.validate.reducer(initialStore, "");

  expect(result).toEqual({ state: "invalid" });
});

test("createChart: validate reducer returns valid state", () => {
  const result = actions.validate.reducer(initialStore, "a");

  expect(result).toEqual({ state: "valid" });
});
