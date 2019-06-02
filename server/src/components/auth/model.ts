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

    const maybePassword = await db.oneOrNone(
      `select data->'data'->>'password' as password from auth.events where data->'data'->>'nickname' = $<nickname>`,
      {
        nickname: validation.value.data.nickname
      }
    );

    if (!maybePassword) {
      const hash = await bcrypt.hash(
        validation.value.data.password,
        saltRounds
      );
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
        type: "auth#login>succeeded",
        cid: props.cid,
        data: "User logged in successfully."
      });
      return;
    }

    const password = maybePassword.password;

    if (typeof password === "string") {
      const passwordMatched = await bcrypt.compare(
        validation.value.data.password,
        password
      );

      if (!passwordMatched) {
        log.next({
          type: "auth#login>failed",
          cid: props.cid,
          data: "Could not login user."
        });
      }
    } else {
      console.log({ maybePassword });
      throw new Error("Password was not a string.");
    }

    // TODO: Return JWT token (as http-only secure cookie?) or error to user.
  }

  return {
    process,
    getLog
  };
}
