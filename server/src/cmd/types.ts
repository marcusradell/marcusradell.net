import * as t from "io-ts";
import { IntFromString } from "io-ts-types/lib/IntFromString";

export const Config = t.type({
  DB_CONNECTION: t.string,
  AUTH_SALT_ROUNDS: IntFromString,
  PORT: IntFromString
});

export type Config = t.TypeOf<typeof Config>;
