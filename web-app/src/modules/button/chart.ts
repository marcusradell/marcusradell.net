import { Store, Chart } from "./types";

const chart: Chart = {
  enabled: {
    disable: (s: Store): Store => ({ state: "disabled" })
  },
  disabled: {
    enable: (s: Store): Store => ({ state: "enabled" })
  }
};

const initialStore: Store = {
  state: "enabled"
};

export function createChart() {
  return {
    chart,
    initialStore
  };
}
