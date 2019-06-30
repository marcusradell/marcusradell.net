/** @jsx jsx */
import React, { FunctionComponent } from "react";
import { jsx, css } from "@emotion/core";
import { Theme } from "../../theme";
import { createChart } from "./chart";
import { createRxm, useStore } from "../../rx-machine";
import { Store, Chart, State } from "./types";

function createStyle(theme: Theme) {
  return css({
    padding: "10px",
    border: "none",
    borderTop: "5px solid",
    borderBottom: `0px solid`,
    borderColor: theme.colors.secondary(70),
    fontSize: "24px",
    fontFamily: "Lucida Console",
    backgroundColor: theme.colors.secondaryComplement(20),
    color: theme.colors.black(70),
    transition: ".2s ease-in-out",
    transitionProperty: "border-bottom border-top",
    boxShadow: "0 8px 6px -6px black",
    "&:focus": {
      borderTop: "0px solid",
      borderBottom: "5px solid",
      borderColor: theme.colors.secondary(70)
    }
  });
}

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
          css={createStyle(theme)}
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
