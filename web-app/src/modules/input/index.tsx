/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Store, Chart, Actions } from "./types";
import { createChart } from "./chart";
import { createStore, useStore } from "rx-machine";
import { FunctionComponent, ChangeEvent } from "react";
import { Theme } from "../../theme";
import { createCss } from "./css";
export * from "./types";

export const createInput = (theme: Theme) => {
  const { initialStore, chart, actions } = createChart();
  const storeStream = createStore<Chart, Store, Actions>(
    chart,
    initialStore,
    actions
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    actions.edit.act(e.target.value);
  };

  const css = createCss(theme);

  const view: FunctionComponent = () => {
    const store = useStore<Store>(initialStore, storeStream);

    return (
      <>
        <input css={css} type="text" value={store.value} onChange={onChange} />
      </>
    );
  };

  return {
    storeStream,
    view
  };
};
