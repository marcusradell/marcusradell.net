/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Store, Chart, Actions } from "./types";
import { createChart } from "./chart";
import { createStore, useStore } from "rx-machine";
import { FunctionComponent, ChangeEvent } from "react";
import { Theme } from "../../theme";
import { createInputCss } from "./input-css";
import { createValidationCss } from "./validation-css";
export * from "./types";

const required = (s: string) => Boolean(s);
const errorMessage = "Field is required.";

export const createNicknameInput = (theme: Theme) => {
  const { initialStore, chart, actions } = createChart(required);
  const storeStream = createStore<Chart, Store, Actions>(
    chart,
    initialStore,
    actions
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    actions.edit.act(e.target.value);
  };

  const inputCss = createInputCss(theme);
  const validationCss = createValidationCss(theme);

  const view: FunctionComponent = () => {
    const store = useStore<Store>(initialStore, storeStream);

    return (
      <>
        <div>
          <input
            css={inputCss}
            type="text"
            value={store.value}
            onChange={onChange}
          />
        </div>
        <div css={validationCss}>
          {store.state === "invalid" ? errorMessage : ""}&nbsp;
        </div>
      </>
    );
  };

  return {
    storeStream,
    view
  };
};
