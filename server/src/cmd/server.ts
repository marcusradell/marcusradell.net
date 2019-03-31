import dotenv from "dotenv";
import { LoggerModel, ILoggerModel } from "../services/logger";
import { Wss } from "../services/wss";
import { Db } from "../services/db";
import uuid from "uuid/v4";
import { Auth } from "../components/auth";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Config } from "./types";

const errorCodes = {
  // TODO: Move out the error codes so it's easier to coordinate the numbers.
};

async function run() {
  const { attach, logger } = setupLogger();

  setupExceptionHandlers(logger);

  const { DB_CONNECTION, AUTH_SALT_ROUNDS, WSS_PORT } = setupConfig(logger);

  const db = await Db({
    attach,
    dbConnection: DB_CONNECTION
  });

  const auth = await Auth({
    attach,
    db,
    authSaltRounds: AUTH_SALT_ROUNDS
  });

  const wss = Wss({
    attach,
    wssPort: WSS_PORT
  });

  wss
    .getMessages()
    .forEach(m => {
      const [component] = m.type.split("#");
      switch (component) {
        case "auth":
          return auth.processAction(m);
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

  wss.init();
}

run();

function setupLogger() {
  const logger = new LoggerModel();
  logger
    .getLog()
    .forEach(s => {
      console.log(s);
      console.log("\n");
    })
    .then(() => {
      console.error(
        "Error: logger.getLog() completed. It should stay alive at all times."
      );
      console.log("\n");
      process.exit(1);
    })
    .catch(e => {
      console.error(e);
      console.log("\n");
      process.exit(2);
    });

  const attach = logger.attach.bind(logger);

  return { logger, attach };
}

function setupExceptionHandlers(logger: ILoggerModel) {
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

function setupConfig(logger: ILoggerModel): Config {
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
