import * as t from "io-ts";
import { Observable } from "rxjs";

export const Message = t.intersection([
  t.type({
    type: t.string,
    cid: t.string,
    clientCid: t.string
  }),
  t.partial({
    data: t.any
  })
]);

export type Message = t.TypeOf<typeof Message>;

export interface IWss {
  getMessages(): Observable<Message>;
  init(): void;
  getLog(): Observable<WssLogMessage>;
}

export enum WssLogTypes {
  ValidateFailed = "wss#validate>failed",
  ParseFailed = "wss#parse>failed",
  ValidateSucceeded = "wss#validate>succeeded"
}

export type WssParseFailed = {
  type: WssLogTypes.ParseFailed;
  cid: string;
};

export type WssValidateFailed = {
  type: WssLogTypes.ValidateFailed;
  cid: string;
  data: string[];
};

export type WssValidateSucceeded = {
  type: WssLogTypes.ValidateSucceeded;
  cid: string;
};

export type WssLogMessage =
  | WssParseFailed
  | WssValidateFailed
  | WssValidateSucceeded;
