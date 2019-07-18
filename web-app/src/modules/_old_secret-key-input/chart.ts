import { Store, Chart } from "./types";

const initialStore: Store = {
  state: "empty",
  data: ""
};

// TODO: Make async
const generate = (s: Store): Store => ({
  ...s,
  state: "hidden",
  data: "password123"
});

const download = (s: Store, effect: () => void): Store => {
  effect();
  return {
    ...s
  };
};

const chart: Chart = {
  empty: {
    generate
  },
  hidden: {
    generate,
    download,
    view: (s: Store) => ({ ...s, state: "visible" })
  },
  visible: {
    generate,
    download,
    hide: (s: Store) => ({ ...s, state: "hidden" })
  }
};

export function createChart() {
  return {
    initialStore,
    chart
  };
}
