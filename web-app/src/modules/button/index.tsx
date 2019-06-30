/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useState, useEffect, FunctionComponent } from "react";
import { Color, Theme } from "../../theme";
import { State, Store, Chart } from "./types";
import { createRxm, useStore } from "../../rx-machine";
import { createChart } from "./chart";
import { createCss } from "./css";
export * from "./types";

export function createButton(theme: Theme, color: Color, text: string) {
  const { initialStore, chart } = createChart();
  const rxm = createRxm<Chart, Store>(chart, initialStore);
  const css = createCss(theme, color);

  const view: FunctionComponent = () => {
    const store = useStore(initialStore, rxm.store);

    return (
      <button disabled={store.state === "disabled"} css={css}>
        {text}
      </button>
    );
  };

  return {
    rxm,
    view
  };
}
