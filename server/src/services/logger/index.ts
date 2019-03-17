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

  public mergeLog(l: Observable<LoggerMessage>) {
    l.forEach(m => this.logSubject.next(m));
  }
}
