import {
  AuthLoginInvalid,
  AuthLoginFailed,
  AuthLoginThrowed,
  AuthLoginSucceeded,
  AuthSignupSucceeded,
  AuthLoginCommand
} from "./types";

export function authLoginInvalid(
  cid: string,
  data: string[]
): AuthLoginInvalid {
  return {
    cid,
    type: "auth#login>invalid",
    data
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
