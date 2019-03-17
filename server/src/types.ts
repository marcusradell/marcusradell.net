import * as t from "io-ts";

export enum UserCommandTypes {
  Login = "login"
}

export const UserLoginCommand = t.type({
  type: t.literal(UserCommandTypes.Login),
  cid: t.string,
  data: t.type({
    nickname: t.string,
    password: t.string
  })
});
