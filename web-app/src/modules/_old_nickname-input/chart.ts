import { Store, Chart } from "./types";

const initialStore: Store = {
  state: "enabled",
  data: ""
};

const chart: Chart = {
  disabled: {
    enable: (s: Store) => ({
      ...s,
      state: "enabled"
    })
  },
  enabled: {
    setNickname: (s: Store, data: string) => ({ ...s, data }),
    disable: (s: Store) => ({ ...s, state: "disabled" })
  }
};

export function createChart() {
  return {
    initialStore,
    chart
  };
}
