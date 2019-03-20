import { PathReporter } from "io-ts/lib/PathReporter";
import { AuthLoginCommand, AuthCommandTypes } from "./types";
import { LoggerMessage } from "../../services/logger/types";
import { Subject } from "rxjs";
import uuid from "uuid/v4";
import { IDb } from "../../services/db/types";
import { Message } from "../../services/wss/types";

export class AuthComponent {
  private log: Subject<LoggerMessage>;
  private db: IDb;

  constructor(db: IDb) {
    this.db = db;
    this.log = new Subject<LoggerMessage>();
  }

  public init() {
    return this.db.getDb().none(`
        create table if not exists auth (
        uuid uuid primary key,
        data jsonb not null,
        created_at timestamptz not null default now()
        )
    `);
  }

  public processAction(m: Message) {
    switch (m.type) {
      case AuthCommandTypes.Login:
        return this.login(m);
      default:
        throw new Error("Message type not supported.");
    }
  }

  public getLog() {
    return this.log.asObservable();
  }

  public login(props: { cid: string; type: string }) {
    const validation = AuthLoginCommand.decode(props);

    if (validation.isLeft()) {
      const report = PathReporter.report(validation);
      const result = {
        cid: props.cid,
        type: `${props.type}>failed`,
        data: report
      };
      this.log.next(result);
      return Promise.reject(result);
    }

    const event = validation.value;

    return this.db
      .getDb()
      .none(`insert into auth values ($<uuid>, $<data>)`, {
        uuid: uuid(),
        data: event
      })
      .then(() => {
        this.log.next({
          type: "server#handle_message>succeeded",
          cid: event.cid,
          data: "User created successfully."
        });
      });
  }
}
