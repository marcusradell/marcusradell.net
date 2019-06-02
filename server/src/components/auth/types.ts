import * as t from "io-ts";

export type AuthLoginFailed = {
  type: "auth#login>failed";
  cid: string;
  data?: unknown;
};

export type AuthLoginSucceeded = {
  type: "auth#login>succeeded";
  cid: string;
  data: { nickname: string };
};

export type AuthSignupSucceeded = {
  type: "auth#signup>succeeded";
  cid: string;
  data: { nickname: string; password?: string };
};

export type AuthLoginEvent =
  | AuthLoginFailed
  | AuthLoginSucceeded
  | AuthSignupSucceeded;

export const AuthLoginCommand = t.type({
  type: t.literal("auth#login"),
  cid: t.string,
  data: t.type({
    nickname: t.string,
    password: t.string
  })
});

export type AuthLoginCommand = t.TypeOf<typeof AuthLoginCommand>;
