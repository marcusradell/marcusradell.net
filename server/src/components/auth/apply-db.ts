import uuid from "uuid/v4";
import { IDatabase } from "pg-promise";
import { AuthLoginEvent } from "./types";

export async function applyDb(db: IDatabase<unknown>, data: AuthLoginEvent) {
  await db.none(`insert into auth.events values ($<uuid>, $<data>)`, {
    uuid: uuid(),
    data
  });
}
