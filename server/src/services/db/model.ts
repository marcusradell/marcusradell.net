import { IMain, IDatabase } from "pg-promise";
import pgPromise from "pg-promise";
import { IDbModel, IDbLogMessage, DbLogTypes } from "./types";
import { Subject, Observable } from "rxjs";
import uuid from "uuid/v4";
export * from "./types";

export class DbModel implements IDbModel {
  private log: Subject<IDbLogMessage>;
  private db: IDatabase<unknown>;

  constructor(dbConnection: string) {
    this.log = new Subject<IDbLogMessage>();
    const pgp: IMain = pgPromise();
    this.db = pgp(dbConnection);
  }

  public getDb() {
    return this.db;
  }

  public async ensureConnection() {
    await this.getDb()
      .one("select 1")
      .catch((e: Error) => {
        this.log.next({
          type: DbLogTypes.InitFailed,
          cid: uuid(),
          data: e
        });
      });

    this.log.next({
      type: DbLogTypes.InitSucceeded,
      cid: uuid()
    });
  }

  public getLog(): Observable<IDbLogMessage> {
    return this.log.asObservable();
  }
}
