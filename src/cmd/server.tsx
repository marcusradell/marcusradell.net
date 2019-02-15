import express from "express";
import { main } from "../main";
import { Subject } from "rxjs";
import dotenv from "dotenv";
import { IMain, IDatabase } from "pg-promise";
import pgPromise from "pg-promise";
import * as WebSocket from "ws";
import * as http from "http";
import React from "react";
import ReactDOMServer from "react-dom/server";

function run() {
  dotenv.config();
  const logSubject = new Subject<string>();

  logSubject
    .forEach(s => console.log(s))
    .then(() => console.log("logSubject completed."))
    .catch(e => console.error(e));

  function log(s: string) {
    logSubject.next(s);
  }

  const app = express();

  app.get("/static", express.static("lib/client"));

  app.get("/", (req, res) => {
    ReactDOMServer.renderToNodeStream(<div>Hello world!</div>).pipe(res);
  });

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      log(`Recieved message: <${message}>.`);
      wss.clients.forEach(c => {
        if (c === ws) {
          log("c === ws");
          return;
        }
        if (c == ws) {
          log("c == ws");
          return;
        }
        c.send(JSON.stringify({ type: "message", payload: message }));
      });
      ws.send(JSON.stringify({ type: "message->succeeded", payload: message }));
    });

    ws.send(JSON.stringify({ type: "ws.connect->succeeded" }));
  });

  if (process.env.PORT === undefined) {
    throw new Error("Missing port value.");
  }

  const pgp: IMain = pgPromise();

  if (process.env.DB_CONNECTION === undefined) {
    throw new Error("Missing DB connection value.");
  }

  const db: IDatabase<any> = pgp(process.env.DB_CONNECTION);

  log("Validating DB connection.");
  db.any(`select (1 + 1)`)
    .then(() => log("DB is ready."))
    .catch(e => {
      log(e);
      process.exit(-1);
    });

  app.listen(process.env.PORT, () => {
    log(`Server started on port <${process.env.PORT}>.`);
    main(log, db);
  });
}

run();
