import {
  AuthLoginCommand,
  AuthLoginEvent,
  AuthLoginSucceeded,
  AuthLoginFailed,
  AuthSignupSucceeded,
  AuthLoginInvalid,
  AuthLoginThrowed
} from "./types";
import { Subject, Observable } from "rxjs";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as bcrypt from "bcrypt";
import { IDatabase } from "pg-promise";
import {
  authLoginInvalid,
  authSignupSucceeded,
  authLoginThrowed,
  authLoginFailed,
  authLoginSucceeded
} from "./events";
import { applyDb } from "./apply-db";

export async function createAuthModel(
  db: IDatabase<unknown>,
  saltRounds: number
) {
  const events = new Subject<AuthLoginEvent>();

  async function process(command: AuthLoginCommand) {
    switch (command.type) {
      case "auth#login":
        return await processLogin(command.cid, command);
    }
  }

  async function apply(event: AuthLoginEvent) {
    switch (event.type) {
      case "auth#login>invalid":
        return await applyLoginInvalid(event);
      case "auth#login>failed":
        return await applyLoginFailed(event);
      case "auth#login>throwed":
        return await applyLoginThrowed(event);
      case "auth#login>succeeded":
        return await applyLoginSucceeded(event);
      case "auth#signup>succeeded":
        return await applySignupSucceded(event);
    }
  }

  async function processLogin(
    cid: string,
    command: unknown
  ): Promise<AuthLoginEvent> {
    const validation = AuthLoginCommand.decode(command);

    if (validation.isLeft()) {
      const report = PathReporter.report(validation);
      return authLoginInvalid(cid, report);
    }

    const { nickname, password } = validation.value.data;

    const nicknameMatch = await db.oneOrNone(
      `select data->'data'->>'password' as password from auth.events where data->>'type' = 'auth#signup>succeeded' and data->'data'->>'nickname' = $<nickname>`,
      {
        nickname: validation.value.data.nickname
      }
    );

    if (!nicknameMatch) {
      // @TODO: Validate minimum password strength.
      return authSignupSucceeded(
        cid,
        validation.value.data.nickname,
        await bcrypt.hash(password, saltRounds)
      );
    }

    const storedPasswordHash = nicknameMatch.password;

    if (typeof storedPasswordHash !== "string") {
      return authLoginThrowed(cid);
    }

    if (!bcrypt.compare(password, storedPasswordHash)) {
      return authLoginFailed(cid, nickname);
    }

    return authLoginSucceeded(cid, nickname);
  }

  async function applyLoginInvalid(event: AuthLoginInvalid) {
    events.next(event);
  }

  async function applyLoginFailed(event: AuthLoginFailed) {
    applyDb(db, event);
    events.next(event);
  }

  async function applyLoginThrowed(event: AuthLoginThrowed) {
    applyDb(db, event);
    events.next(event);
  }

  async function applyLoginSucceeded(event: AuthLoginSucceeded) {
    applyDb(db, event);
    events.next(event);
  }

  async function applySignupSucceded(event: AuthSignupSucceeded) {
    applyDb(db, event);

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
    events: events as Observable<AuthLoginEvent>
  };
}
