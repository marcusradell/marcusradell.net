import dotenv from "dotenv";
import { Logger } from "../services/logger";
import { WebSocketServer } from "../services/wss";
import { Db } from "../services/db";
import { UserCommandTypes, UserLoginCommand } from "../types";
import { PathReporter } from "io-ts/lib/PathReporter";
import uuid from "uuid/v4";

async function run() {
  dotenv.config();

  const logger = new Logger();
  logger
    .getLog()
    .forEach(s => {
      console.log(s);
      console.log("\n");
    })
    .then(() => {
      console.error("logSubject completed.");
      console.log("\n");
      process.exit(1);
    })
    .catch(e => {
      console.error(e);
      console.log("\n");
      process.exit(2);
    });

  process.on("uncaughtException", e => {
    logger.log({
      cid: uuid(),
      type: "uncaught_exception",
      data: {
        name: e.name,
        message: e.message,
        stack: e.stack
      }
    });
    process.exit(3);
  });

  process.on("unhandledRejection", e => {
    logger.log({
      cid: uuid(),
      type: "uncaught_exception",
      data: {
        name: e.name,
        message: e.message,
        stack: e.stack
      }
    });
    process.exit(4);
  });

  if (process.env.DB_CONNECTION === undefined) {
    throw new Error("Missing DB_CONNECTION.");
  }

  const db = new Db(process.env.DB_CONNECTION, 100);
  logger.mergeLog(db.getLog());

  await db.init();

  if (process.env.PORT === undefined) {
    throw new Error("Missing PORT.");
  }

  const wss = new WebSocketServer(parseInt(process.env.PORT, 10));
  logger.mergeLog(wss.getLog());

  wss.getMessages().forEach(m => {
    switch (m.type) {
      case UserCommandTypes.Login:
        const validationResult = UserLoginCommand.decode(m);
        if (validationResult.isLeft()) {
          logger.log({
            type: "server#handle_message>failed",
            cid: m.cid,
            data: PathReporter.report(validationResult)
          });
          return;
        }
        return db
          .getDb()
          .none(`insert into users values ($<uuid>, $<data>)`, {
            uuid: uuid(),
            data: m.data
          })
          .then(() => {
            logger.log({
              type: "server#handle_message>succeeded",
              cid: m.cid,
              data: "User created successfully."
            });
          });
      default:
        logger.log({
          type: "server#handle_message>failed",
          cid: m.cid,
          data: `Got unsupported message type <${m.type}>.`
        });
    }
  });

  wss.init();
}

run();
