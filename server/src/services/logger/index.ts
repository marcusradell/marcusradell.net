import { Subject, Observable } from "rxjs";
import { LoggerMessage, ILogger } from "./types";

export class Logger implements ILogger {
  private logSubject: Subject<LoggerMessage>;

  constructor() {
    this.logSubject = new Subject<LoggerMessage>();
  }

  public getLog() {
    return this.logSubject.asObservable();
  }

  public mergeLog(messages: Observable<LoggerMessage>) {
    messages.forEach(m => this.log(m));
  }

  public log(m: LoggerMessage) {
    this.logSubject.next(m);
  }
}
