import { Observable } from "rxjs";

export type LoggerMessage = {
  type: string;
  cid: string;
  data?: unknown;
};

export interface ILogger {
  getLog(): Observable<LoggerMessage>;
  attach(l: Observable<LoggerMessage>): void;
  log(m: LoggerMessage): void;
}
