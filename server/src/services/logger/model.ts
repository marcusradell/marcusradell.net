import { Subject, Observable } from "rxjs";
import { LoggerMessage, ILogger } from "./types";
import uuid from "uuid/v4";

export function createLogger(): ILogger {
  const logSubject: Subject<LoggerMessage> = new Subject<LoggerMessage>();

  logSubject
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

  function log(m: LoggerMessage) {
    logSubject.next(m);
  }

  function getLog() {
    return logSubject.asObservable();
  }

  function attach(messages: Observable<LoggerMessage>) {
    messages
      .forEach(m => logSubject.next(m))
      .then(() => {
        log({ cid: uuid(), type: "logger#attach>completed" });
        process.exit(1);
      })
      .catch(error => {
        log({
          cid: uuid(),
          type: "logger#attach>exception",
          data: {
            code: error.code,
            message: error.message,
            stack: error.stack
          }
        });
        process.exit(2);
      });
  }

  return {
    getLog,
    attach,
    log
  };
}
