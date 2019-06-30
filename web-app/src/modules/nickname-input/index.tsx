/** @jsx jsx */
import React, { FunctionComponent } from "react";
import { jsx } from "@emotion/core";
import { Theme } from "../../theme";
import { createChart } from "./chart";
import { createRxm, useStore } from "../../rx-machine";
import { Store, Chart } from "./types";
import { createCss } from "./css";

export function createNicknameInput(theme: Theme) {
  const { initialStore, chart } = createChart();

  const rxm = createRxm<Chart, Store>(chart, initialStore);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    rxm.machine.enabled.setNickname.trigger(event.target.value);
  }

  const view: FunctionComponent = () => {
    const store = useStore(initialStore, rxm.store);

    return (
      <>
        <input
          type="text"
          disabled={store.state === "disabled"}
          css={createCss(theme)}
          onChange={onChange}
          value={store.data}
          placeholder="Nickname"
        />
      </>
    );
  };

  return {
    rxm,
    view
  };
}
