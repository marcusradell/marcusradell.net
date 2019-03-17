import React from "react";
import ReactDOM from "react-dom";
import { AppComponent } from "./app";
import "./components/input";
import * as serviceWorker from "./serviceWorker";
import { Ws, IWs } from "./services/ws";
import uuid from "uuid/v4";

const ws: IWs = new Ws("ws://localhost:3001");

ws.getMessageStream().forEach(m => {
  console.log(`Recieved message <${m}>.`);
});

ws.publish("ping");

const appComponent = new AppComponent(ws);
(window as any).appComponent = appComponent;

const App = appComponent.createView();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
