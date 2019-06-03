import { createAuthModel } from "./model";
import { LoggerMessage } from "../../services/logger/types";
import { Observable } from "rxjs";
import { IDatabase } from "pg-promise";
import { migrate } from "./migrate";
export * from "./types";

export async function Auth(args: {
  attach: (l: Observable<LoggerMessage>) => void;
  db: IDatabase<unknown>;
  authSaltRounds: number;
}) {
  const model = await createAuthModel(args.db, args.authSaltRounds);
  args.attach(model.events);
  await migrate(args.db);

  return model;
}
