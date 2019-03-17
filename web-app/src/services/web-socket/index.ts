import { WebSocketSubject, webSocket } from "rxjs/webSocket";
import { Observable } from "rxjs";
import { Message, IWebSocket } from "./types";
import uuid from "uuid/v4";
export * from "./types";

export class WebSocket implements IWebSocket {
  private ws: WebSocketSubject<Message>;

  constructor(url: string) {
    this.ws = webSocket<Message>({ url });
  }

  public getMessageStream(): Observable<Message> {
    return this.ws.asObservable();
  }

  public publish(type: string, data?: any): string {
    const cid = uuid();
    this.ws.next({
      type,
      data,
      cid
    });
    return cid;
  }
}
