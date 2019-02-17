import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import * as serviceWorker from "./serviceWorker";
import { webSocket } from "rxjs/webSocket";

const ws = webSocket({ url: "ws://localhost:3001" });
ws.forEach(s => console.log(s));
ws.next("test");

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
