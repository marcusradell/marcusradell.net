import { PathReporter } from "io-ts/lib/PathReporter";
import { AuthLoginCommand, AuthCommandTypes } from "./types";
import { LoggerMessage } from "../../services/logger/types";
import { Subject } from "rxjs";
import uuid from "uuid/v4";
import { Message } from "../../services/wss/types";
import * as bcrypt from "bcrypt";
import { IDatabase } from "pg-promise";

export async function createAuthModel(db: IDatabase<any>, saltRounds: number) {
  const log: Subject<LoggerMessage> = new Subject<LoggerMessage>();

  await db.none(`
    create schema if not exists auth
  `);
  await db.none(`
    create table if not exists auth.events (
      uuid uuid primary key,
      data jsonb not null,
      created_at timestamptz default now()
    )`);

  function process(m: Message) {
    switch (m.type) {
      case AuthCommandTypes.Login:
        return login(m);
      default:
        throw new Error("Message type not supported.");
    }
  }

  function getLog() {
    return log.asObservable();
  }

  async function login(props: { cid: string; type: string }) {
    const validation = AuthLoginCommand.decode(props);

    if (validation.isLeft()) {
      const report = PathReporter.report(validation);
      const result = {
        cid: props.cid,
        type: `${props.type}>failed`,
        data: report
      };
      log.next(result);
      return result;
    }

    const hash = await bcrypt.hash(validation.value.data.password, saltRounds);
    const event = {
      ...validation.value,
      data: {
        ...validation.value.data,
        password: hash
      }
    };

    await db.none(`insert into auth.events values ($<uuid>, $<data>)`, {
      uuid: uuid(),
      data: event
    });

    log.next({
      type: "server#handle_message>succeeded",
      cid: event.cid,
      data: "User created successfully."
    });
  }

  return {
    process,
    getLog
  };
}
