import { Observable, Subject } from "rxjs";
import Ws from "ws";

type Action = {
  type: string;
  meta: {
    cid: string;
  };
  payload: any;
};

interface IWebSocketServer {
  getStream(): Observable<Action>;
}

export class WebSocketServer implements IWebSocketServer {
  private wsServer: any;
  private wsSubject: Subject<Action>;

  constructor(port: number) {
    this.wsSubject = new Subject<Action>();
    this.wsServer = new Ws.Server({ port });

    this.wsServer.on("connection", (wsc: Ws) => {
      console.log("wsServer connection");
      wsc.on("message", (message: string) => {
        console.log(`Got message <${message}>.`);
        // TODO: Make sure it's the correct type
        this.wsSubject.next(JSON.parse(message));
        // this.wsServer.clients.forEach((c: Ws) => {
        //   if (c === wsc) {
        //     return;
        //   }
        //   c.send(message);
        // });
        // wsc.send(JSON.stringify(message));
      });
    });
  }

  public getStream() {
    return this.wsSubject.asObservable();
  }
}
