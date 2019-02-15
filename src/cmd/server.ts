import express from "express";
import { main } from "../main";
import { Subject } from "rxjs";
import dotenv from "dotenv";
import { IMain, IDatabase } from "pg-promise";
import pgPromise from "pg-promise";
import bodyParser = require("body-parser");

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
  app.use(bodyParser.json());

  app.post("api/command", (req, res) => {});
  app.get("api/query", (req, res) => {});

  if (process.env.PORT === undefined) {
    throw new Error("Missing port value.");
  }

  const pgp: IMain = pgPromise();

  if (process.env.DB_CONNECTION === undefined) {
    throw new Error("Missing DB connection value.");
  }

  const db: IDatabase<any> = pgp(process.env.DB_CONNECTION);

  db.any(`select (1 + 1)`)
    .then(() => log("DB is ready."))
    .then(() => {
      app.listen(process.env.PORT, () => {
        log(`Server started on port <${process.env.PORT}>.`);
        main(log, db);
      });
    })
    .catch(e => {
      log(e);
      process.exit(-1);
    });
}

run();
