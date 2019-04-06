import { Subject, Observable } from "rxjs";
import { LoggerMessage, ILoggerModel } from "./types";

export class LoggerModel implements ILoggerModel {
  private logSubject: Subject<LoggerMessage>;

  constructor() {
    this.logSubject = new Subject<LoggerMessage>();
  }

  public getLog() {
    return this.logSubject.asObservable();
  }

  public attach(messages: Observable<LoggerMessage>) {
    messages.forEach(m => this.log(m));
  }

  public log(m: LoggerMessage) {
    this.logSubject.next(m);
  }
}
