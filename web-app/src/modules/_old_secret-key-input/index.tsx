/** @jsx jsx */
import React, { FunctionComponent } from "react";
import { jsx } from "@emotion/core";
import { Theme } from "../../theme";
import { createChart } from "./chart";
import { createRxm, useStore } from "../../rx-machine";
import { Store, Chart } from "./types";
// import { createCss } from "./css";

export function createSecretKeyInput(theme: Theme) {
  const { initialStore, chart } = createChart();

  const rxm = createRxm<Chart, Store>(chart, initialStore);

  const view: FunctionComponent = () => {
    const store = useStore(initialStore, rxm.store);

    function onDownload() {
      if (store.state === "empty") {
        return;
      }

      function downloadSecret() {
        const data = new Blob([store.data], { type: "text/plain" });
        const url = window.URL.createObjectURL(data);
        const tempLink = document.createElement("a");
        tempLink.href = url;
        tempLink.setAttribute("download", "secret.txt");
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      }

      rxm.machine[store.state].download.trigger(downloadSecret);
    }

    return (
      <>
        <div>
          <button onClick={() => rxm.machine.empty.generate.trigger()}>
            Generate
          </button>
          <button onClick={() => rxm.machine.hidden.view.trigger()}>
            View
          </button>
          <button onClick={() => rxm.machine.visible.hide.trigger()}>
            Hide
          </button>
          <button onClick={onDownload}>Download</button>
        </div>
        <div>
          {store.state === "visible" ? (
            <input type="text" readOnly value={store.data} />
          ) : (
            <input type="password" readOnly disabled value={store.data} />
          )}
        </div>
      </>
    );
  };

  return {
    rxm,
    view
  };
}
