import { ButtonStore, ButtonChart } from "./types";

const chart: ButtonChart = {
  enabled: {
    disable: (s: ButtonStore): ButtonStore => ({ state: "disabled" })
  },
  disabled: {
    enable: (s: ButtonStore): ButtonStore => ({ state: "enabled" })
  }
};

const initialStore: ButtonStore = {
  state: "enabled"
};

export function createChart() {
  return {
    chart,
    initialStore
  };
}
