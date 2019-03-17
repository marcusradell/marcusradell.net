import { PathReporter } from "io-ts/lib/PathReporter";
import { Subject } from "rxjs";
import Ws from "ws";
import { IWss, Message, WssLogTypes, WssLogMessage } from "./types";
import uuid from "uuid/v4";

export class WebSocketServer implements IWss {
  private wss: Ws.Server;
  private messageSubject: Subject<Message>;
  private logSubject: Subject<WssLogMessage>;

  constructor(port: number) {
    this.messageSubject = new Subject<Message>();
    this.logSubject = new Subject<WssLogMessage>();
    this.wss = new Ws.Server({ port });
  }

  public init() {
    this.wss.on("connection", (wsc: Ws) => {
      wsc.on("message", (messageString: string) => {
        try {
          const message: unknown = JSON.parse(messageString);
          const validationResult = Message.decode(message);

          if (validationResult.isLeft()) {
            this.logSubject.next({
              type: WssLogTypes.ValidateFailed,
              cid: uuid(),
              data: PathReporter.report(validationResult)
            });
            return;
          }

          this.logSubject.next({
            type: WssLogTypes.ValidateSucceeded,
            cid: validationResult.value.cid
          });

          this.messageSubject.next(validationResult.value);
        } catch (e) {
          this.logSubject.next({
            type: WssLogTypes.ParseFailed,
            cid: uuid()
          });
        }
      });
    });
  }

  public getMessages() {
    return this.messageSubject.asObservable();
  }

  public getLog() {
    return this.logSubject.asObservable();
  }
}

// NOTE: this is a snippet if we need to broadcast to other clients.
// this.wsServer.clients.forEach((c: Ws) => {
//   if (c === wsc) {
//     return;
//   }
//   c.send(message);
// });
