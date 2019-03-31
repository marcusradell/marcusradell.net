import { Observable } from "rxjs";

export type LoggerMessage = {
  type: string;
  cid: string;
  data?: any;
};

export interface ILoggerModel {
  getLog(): Observable<LoggerMessage>;
  attach(l: Observable<LoggerMessage>): void;
  log(m: LoggerMessage): void;
}
