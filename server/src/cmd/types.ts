import * as t from "io-ts";

export const Config = t.type({
  DB_CONNECTION: t.string,
  AUTH_SALT_ROUNDS: t.number,
  WSS_PORT: t.number
});

export type Config = t.TypeOf<typeof Config>;
