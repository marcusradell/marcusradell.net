import { LoggerMessage } from "../../services/logger/types";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";
import { createJwtModel } from "./model";

export async function Jwt(props: {
  attach: (l: Observable<LoggerMessage>) => void;
  secret: string;
}) {
  const model = await createJwtModel(props.secret);
  props.attach(model.getEvents());
  return model;
}
