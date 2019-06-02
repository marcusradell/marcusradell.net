import { PathReporter } from "io-ts/lib/PathReporter";
import {
  AuthLoginCommand,
  AuthLoginEvent,
  AuthLoginSucceeded,
  AuthLoginFailed,
  AuthSignupSucceeded
} from "./types";
import { Subject, Observable } from "rxjs";
import uuid from "uuid/v4";
import * as bcrypt from "bcrypt";
import { IDatabase } from "pg-promise";

export async function createAuthModel(
  db: IDatabase<unknown>,
  saltRounds: number
) {
  const events: Subject<AuthLoginEvent> = new Subject<AuthLoginEvent>();

  async function process(command: AuthLoginCommand) {
    switch (command.type) {
      case "auth#login":
        return await processLogin(command.cid, command);
    }
  }

  async function apply(event: AuthLoginEvent) {
    switch (event.type) {
      case "auth#login>failed":
        return await applyLoginFailed(event);
      case "auth#login>succeeded":
        return await applyLoginSucceeded(event);
      case "auth#signup>succeeded":
        return await applySignupSucceded(event);
    }
  }

  function getEvents(): Observable<AuthLoginEvent> {
    return events.asObservable();
  }

  const loginFailedType = "auth#login>failed" as const;
  const loginSucceededType = "auth#login>succeeded" as const;
  const signupSucceededType = "auth#signup>succeeded" as const;

  async function processLogin(
    cid: string,
    props: unknown
  ): Promise<AuthLoginEvent> {
    const validation = AuthLoginCommand.decode(props);

    if (validation.isLeft()) {
      const report = PathReporter.report(validation);

      return {
        cid,
        type: loginFailedType,
        data: report
      };
    }

    const nicknameMatch = await db.oneOrNone(
      `select data->'data'->>'password' as password from auth.events where data->>'type' = 'auth#signup>succeeded' and data->'data'->>'nickname' = $<nickname>`,
      {
        nickname: validation.value.data.nickname
      }
    );

    if (!nicknameMatch) {
      // @TODO: Validate minimum password strength.

      return {
        type: signupSucceededType,
        cid,
        data: {
          nickname: validation.value.data.nickname,
          password: await bcrypt.hash(
            validation.value.data.password,
            saltRounds
          )
        }
      };
    }

    const storedPasswordHash = nicknameMatch.password;

    if (typeof storedPasswordHash !== "string") {
      return {
        type: loginFailedType,
        cid,
        data: [
          "Exception while trying to login. Stored password was not a string."
        ]
      };
    }

    const passwordMatched = await bcrypt.compare(
      validation.value.data.password,
      storedPasswordHash
    );

    if (!passwordMatched) {
      return {
        type: loginFailedType,
        cid,
        data: [`Could not login <${validation.value.data.nickname}>.`]
      };
    }

    return {
      type: loginSucceededType,
      cid,
      data: {
        nickname: validation.value.data.nickname
      }
    };
  }

  async function applyLoginFailed(event: AuthLoginFailed) {
    await db.none(`insert into auth.events values ($<uuid>, $<data>)`, {
      uuid: uuid(),
      data: event
    });

    events.next(event);
  }

  async function applyLoginSucceeded(event: AuthLoginSucceeded) {
    await db.none(`insert into auth.events values ($<uuid>, $<data>)`, {
      uuid: uuid(),
      data: event
    });

    events.next(event);
  }

  async function applySignupSucceded(event: AuthSignupSucceeded) {
    await db.none(`insert into auth.events values ($<uuid>, $<data>)`, {
      uuid: uuid(),
      data: event
    });

    const eventWithoutPassword = {
      ...event,
      data: {
        nickname: event.data.nickname
      }
    };

    events.next(eventWithoutPassword);
  }

  return {
    process,
    apply,
    getEvents
  };
}
