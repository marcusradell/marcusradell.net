import { PathReporter } from "io-ts/lib/PathReporter";
import { Subject } from "rxjs";
import Ws from "ws";
import { IWss, Message, WssLogTypes, WssLogMessage } from "./types";
import uuid from "uuid/v4";

export function createWss(port: number): IWss {
  const wss: Ws.Server = new Ws.Server({ port });
  const messageSubject: Subject<Message> = new Subject<Message>();
  const logSubject: Subject<WssLogMessage> = new Subject<WssLogMessage>();

  wss.on("connection", (wsc: Ws) => {
    wsc.on("message", (messageString: string) => {
      try {
        const message: unknown = {
          ...JSON.parse(messageString),
          cid: uuid()
        };
        const validationResult = Message.decode(message);

        if (validationResult.isLeft()) {
          logSubject.next({
            type: WssLogTypes.ValidateFailed,
            cid: uuid(),
            data: PathReporter.report(validationResult)
          });
          return;
        }

        logSubject.next({
          type: WssLogTypes.ValidateSucceeded,
          cid: validationResult.value.cid
        });

        messageSubject.next(validationResult.value);
      } catch (e) {
        logSubject.next({
          type: WssLogTypes.ParseFailed,
          cid: uuid()
        });
      }
    });
  });

  function getMessages() {
    return messageSubject.asObservable();
  }

  function getLog() {
    return logSubject.asObservable();
  }

  return {
    getLog,
    getMessages
  };
}

// NOTE: this is a snippet if we need to broadcast to other clients.
// this.wsServer.clients.forEach((c: Ws) => {
//   if (c === wsc) {
//     return;
//   }
//   c.send(message);
// });
