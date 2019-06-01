import { createAuthModel } from "./model";
import { LoggerMessage } from "../../services/logger/types";
import { Observable } from "rxjs";
import { IDatabase } from "pg-promise";
export * from "./types";

export async function Auth(props: {
  attach: (l: Observable<LoggerMessage>) => void;
  db: IDatabase<any>;
  authSaltRounds: number;
}) {
  const model = await createAuthModel(props.db, props.authSaltRounds);
  props.attach(model.getLog());
  return model;
}
