import { WebSocketSubject, webSocket } from "rxjs/webSocket";
import { Observable } from "rxjs";
import { Message, IWs } from "./types";
import uuid from "uuid/v4";
export * from "./types";

export class Ws implements IWs {
  private ws: WebSocketSubject<Message>;

  constructor(url: string) {
    this.ws = webSocket<Message>({ url });
  }

  public getMessageStream(): Observable<Message> {
    return this.ws.asObservable();
  }

  public publish(type: string, data?: any): string {
    const cid = uuid();
    const m = {
      type,
      data,
      cid
    };
    this.ws.next(m);
    return cid;
  }
}
