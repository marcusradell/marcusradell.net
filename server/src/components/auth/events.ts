import {
  AuthLoginInvalid,
  AuthLoginFailed,
  AuthLoginThrowed,
  AuthLoginSucceeded,
  AuthSignupSucceeded,
  AuthLoginCommand
} from "./types";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Either } from "fp-ts/lib/Either";
import { Errors } from "io-ts";

export function authLoginInvalid(
  cid: string,
  validation: Either<Errors, AuthLoginCommand>
): AuthLoginInvalid {
  return {
    cid,
    type: "auth#login>invalid",
    data: PathReporter.report(validation)
  };
}

export function authSignupSucceeded(
  cid: string,
  nickname: string,
  passwordHash: string
): AuthSignupSucceeded {
  return {
    type: "auth#signup>succeeded",
    cid,
    data: {
      nickname,
      passwordHash
    }
  };
}

export function authLoginThrowed(cid: string): AuthLoginThrowed {
  return {
    type: "auth#login>throwed",
    cid,
    data: ["Exception while trying to login. Stored password was not a string."]
  };
}

export function authLoginFailed(
  cid: string,
  nickname: string
): AuthLoginFailed {
  return {
    type: "auth#login>failed",
    cid,
    data: { nickname }
  };
}

export function authLoginSucceeded(
  cid: string,
  nickname: string
): AuthLoginSucceeded {
  return {
    type: "auth#login>succeeded",
    cid,
    data: {
      nickname
    }
  };
}
