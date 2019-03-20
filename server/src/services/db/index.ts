import { IMain, IDatabase } from "pg-promise";
import pgPromise from "pg-promise";
import { IDb, IDbLogMessage, DbLogTypes } from "./types";
import { Subject, Observable } from "rxjs";
import uuid from "uuid/v4";

export class Db implements IDb {
  private log: Subject<IDbLogMessage>;
  private db: IDatabase<any>;
  private initialized: boolean;
  private baseExitCode: number;

  constructor(connection: string, baseExitCode: number) {
    this.log = new Subject<IDbLogMessage>();
    const pgp: IMain = pgPromise();
    this.db = pgp(connection);
    this.initialized = false;
    this.baseExitCode = baseExitCode;
  }

  public async init() {
    await this.db.one("select 1").catch(e => {
      this.log.next({
        type: DbLogTypes.InitFailed,
        cid: uuid(),
        data: e
      });
      process.exit(this.baseExitCode + 1);
    });

    this.log.next({
      type: DbLogTypes.InitSucceeded,
      cid: uuid()
    });

    this.initialized = true;
  }

  public getDb() {
    if (!this.initialized) {
      this.log.next({
        type: DbLogTypes.GetDbFailed,
        cid: uuid(),
        data: "DB must be initialized before calling getDB()."
      });
      process.exit(this.baseExitCode + 2);
    }

    return this.db;
  }

  public getLog(): Observable<IDbLogMessage> {
    return this.log.asObservable();
  }
}
