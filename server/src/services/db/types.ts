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

export type DbGetDbFailed = {
  type: DbLogTypes.GetDbFailed;
  cid: string;
  data: string;
};

export type IDbLogMessage = DbInitSucceeded | DbInitFailed | DbGetDbFailed;

export interface IDb {
  getLog: () => Observable<IDbLogMessage>;
  init: () => Promise<void>;
  getDb: () => IDatabase<any>;
}
