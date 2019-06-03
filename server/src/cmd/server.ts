import dotenv from "dotenv";
import { createLogger, ILogger } from "../services/logger";
import { Wss } from "../services/wss";
import { Db } from "../services/db";
import uuid from "uuid/v4";
import { Auth } from "../components/auth";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Config } from "./types";

async function run() {
  const logger = createLogger();

  setupExceptionHandlers(logger);

  const { DB_CONNECTION, AUTH_SALT_ROUNDS, PORT } = setupConfig(logger);

  const db = await Db({
    attach: logger.attach,
    dbConnection: DB_CONNECTION
  });

  const auth = await Auth({
    attach: logger.attach,
    db,
    authSaltRounds: AUTH_SALT_ROUNDS
  });

  const wss = Wss({
    attach: logger.attach,
    wssPort: PORT
  });

  wss
    .getMessages()
    .forEach(m => {
      const [component] = m.type.split("#");
      switch (component) {
        case "auth":
          return auth.process(m);
        default:
          logger.log({
            type: "server#handle_message>failed",
            cid: m.cid,
            data: `Got unsupported message type <${m.type}>.`
          });
      }
    })
    .then(() => {
      logger.log({
        type: "server#handle_message>failed",
        cid: uuid(),
        data:
          "Error: wss.getMessages() completed. It should stay open at all times."
      });
      process.exit(6);
    });
}

run();

function setupExceptionHandlers(logger: ILogger) {
  process.on("uncaughtException", e => {
    logger.log({
      cid: uuid(),
      type: "server#run>failed",
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
      type: "server#run>failed",
      data: {
        name: e.name,
        message: e.message,
        stack: e.stack
      }
    });
    process.exit(4);
  });
}

function setupConfig(logger: ILogger): Config {
  dotenv.config();

  const validation = Config.decode(process.env);
  if (validation.isLeft()) {
    logger.log({
      type: "config#validate>failed",
      cid: uuid(),
      data: PathReporter.report(validation)
    });
    return process.exit(5);
  }

  return validation.value;
}
