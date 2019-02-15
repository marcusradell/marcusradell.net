import { Log } from "../types";
import { IDatabase } from "pg-promise";

export function main(log: Log, db: IDatabase<any>) {
  log("Main called.");
}
