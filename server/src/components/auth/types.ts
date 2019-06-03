import * as t from "io-ts";

export type AuthLoginInvalid = {
  type: "auth#login>invalid";
  cid: string;
  data: string[];
};

export type AuthLoginThrowed = {
  type: "auth#login>throwed";
  cid: string;
  data: string[];
};

export type AuthLoginFailed = {
  type: "auth#login>failed";
  cid: string;
  data: { nickname: string };
};

export type AuthLoginSucceeded = {
  type: "auth#login>succeeded";
  cid: string;
  data: { nickname: string };
};

export type AuthSignupSucceeded = {
  type: "auth#signup>succeeded";
  cid: string;
  data: { nickname: string; passwordHash?: string };
};

export type AuthLoginEvent =
  | AuthLoginInvalid
  | AuthLoginFailed
  | AuthLoginThrowed
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
