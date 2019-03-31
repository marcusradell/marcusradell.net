import { PathReporter } from "io-ts/lib/PathReporter";
import { AuthLoginCommand, AuthCommandTypes } from "./types";
import { LoggerMessage } from "../../services/logger/types";
import { Subject } from "rxjs";
import uuid from "uuid/v4";
import { Message } from "../../services/wss/types";
import * as bcrypt from "bcrypt";
import { IDatabase } from "pg-promise";

export class AuthModel {
  private log: Subject<LoggerMessage> = new Subject<LoggerMessage>();

  constructor(private db: IDatabase<any>, private saltRounds: number) {}

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

  public async init() {
    await this.db.none(`
    create schema if not exists auth
  `);
    await this.db.none(`
    create table if not exists auth.events (
      uuid uuid primary key,
      data jsonb not null,
      created_at timestamptz default now()
    )`);
    return;
  }

  private async login(props: { cid: string; type: string }) {
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

    const hash = await bcrypt.hash(
      validation.value.data.password,
      this.saltRounds
    );
    const event = {
      ...validation.value,
      data: {
        ...validation.value.data,
        password: hash
      }
    };

    await this.db.none(`insert into auth.events values ($<uuid>, $<data>)`, {
      uuid: uuid(),
      data: event
    });

    this.log.next({
      type: "server#handle_message>succeeded",
      cid: event.cid,
      data: "User created successfully."
    });
  }
}
