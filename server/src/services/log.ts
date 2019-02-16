import { Subject } from "rxjs";

type MessageType = "info" | "error";

type Message = {
  type: MessageType;
  cid: string;
  payload: string;
};

interface ILogger {
  info(s: string, cid: string): void;
  error(s: string, cid: string): void;
}

export class Logger implements ILogger {
  private logSubject: Subject<Message>;
  constructor() {
    this.logSubject = new Subject<Message>();
  }

  public info(s: string, cid: string) {
    this.logSubject.next({ type: "info", cid, payload: s });
  }

  public error(s: string, cid: string) {
    this.logSubject.next({ type: "error", cid, payload: s });
  }

  public getLog() {
    return this.logSubject.asObservable();
  }
}
