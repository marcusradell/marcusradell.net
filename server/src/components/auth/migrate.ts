import { IDatabase } from "pg-promise";

export async function migrate(db: IDatabase<unknown>) {
  await db.none(`
      create schema if not exists auth
    `);
  await db.none(`
      create table if not exists auth.events (
        uuid uuid primary key,
        data jsonb not null,
        created_at timestamptz default now()
      )`);
}
