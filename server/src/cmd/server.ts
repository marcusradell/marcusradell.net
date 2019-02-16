import dotenv from "dotenv";
import { IMain, IDatabase } from "pg-promise";
import pgPromise from "pg-promise";
import { Logger } from "../services/log";
import uuid from "uuid/v4";
import { WebSocketServer } from "../services/web-socket-server";

function run() {
  dotenv.config();
  const bootstrapCid = uuid();

  const logger = new Logger();
  logger
    .getLog()
    .forEach(s => console.log(s))
    .then(() => console.log("logSubject completed."))
    .catch(e => console.error(e));

  const pgp: IMain = pgPromise();

  if (process.env.DB_CONNECTION === undefined) {
    throw new Error("Missing DB connection value.");
  }

  const db: IDatabase<any> = pgp(process.env.DB_CONNECTION);

  logger.info("Validating DB connection.", bootstrapCid);
  db.any(`select (1 + 1)`)
    .then(() => logger.info("DB is ready.", bootstrapCid))
    .catch(e => {
      logger.error(e, bootstrapCid);
      process.exit(-1);
    });

  if (process.env.PORT === undefined) {
    throw new Error("Missing port value.");
  }

  const wss = new WebSocketServer(parseInt(process.env.PORT, 10));
}

run();
