import React from "react";
import ReactDOM from "react-dom";
import { AppComponent } from "./app";
import * as serviceWorker from "./serviceWorker";
import { Ws, IWs } from "./services/ws";

if (!process.env.REACT_APP_WS_URL) {
  throw new Error("Missing REACT_APP_WS_URL.");
}

const ws: IWs = new Ws(process.env.REACT_APP_WS_URL);

ws.getMessageStream().forEach(m => {
  console.log(`Recieved message <${m}>.`);
});

const appComponent = new AppComponent(ws);
(window as any).appComponent = appComponent;

const App = appComponent.createView();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
