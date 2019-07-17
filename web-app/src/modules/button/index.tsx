/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FunctionComponent } from "react";
import { Color, Theme } from "../../theme";
import { Store, Chart, Actions } from "./types";
import { createStore, useStore } from "rx-machine";
import { createChart } from "./chart";
import { createCss } from "./css";
export * from "./types";

export function createButton(theme: Theme, color: Color, text: string) {
  const { chart, initialStore, actions } = createChart();
  const storeStream = createStore<Chart, Store, Actions>(
    chart,
    initialStore,
    actions
  );
  const css = createCss(theme, color);

  const view: FunctionComponent = () => {
    const store = useStore(initialStore, storeStream);

    return (
      <button disabled={store.state === "disabled"} css={css}>
        {text}
      </button>
    );
  };

  return {
    storeStream,
    view
  };
}
