import { Observable } from "rxjs";
import { IDbLogMessage } from "./types";
import { DbModel } from "./model";

export async function Db(props: {
  attach: (l: Observable<IDbLogMessage>) => void;
  dbConnection: string;
}) {
  const db = new DbModel(props.dbConnection);
  props.attach(db.getLog());
  await db.ensureConnection();
  return db.getDb();
}
