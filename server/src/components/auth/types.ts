import * as t from "io-ts";

export enum AuthCommandTypes {
  Login = "auth#login"
}

export const AuthLoginCommand = t.type({
  type: t.literal(AuthCommandTypes.Login),
  cid: t.string,
  data: t.type({
    nickname: t.string,
    password: t.string
  })
});
