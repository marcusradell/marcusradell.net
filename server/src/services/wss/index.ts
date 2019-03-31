export * from "./types";
import { WssModel } from "./model";
import { Observable } from "rxjs";
import { WssLogMessage } from "./types";

export function Wss(props: {
  attach: (l: Observable<WssLogMessage>) => void;
  wssPort: number;
}) {
  const model = new WssModel(props.wssPort);
  props.attach(model.getLog());
  return model;
}
