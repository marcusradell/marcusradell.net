import { Observable } from "rxjs";
import { IDatabase } from "pg-promise";

export enum DbLogTypes {
  InitSucceeded = "db#init>succeeded",
  InitFailed = "db#init>failed",
  GetDbFailed = "db#get_db>failed"
}

export type DbInitFailed = {
  type: DbLogTypes.InitFailed;
  cid: string;
  data: Error;
};

export type DbInitSucceeded = {
  type: DbLogTypes.InitSucceeded;
  cid: string;
};

export type IDbLogMessage = DbInitSucceeded | DbInitFailed;

export interface IDbModel {
  getLog: () => Observable<IDbLogMessage>;
  ensureConnection: () => Promise<void>;
  getDb: () => IDatabase<unknown>;
}
