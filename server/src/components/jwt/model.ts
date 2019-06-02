import { Subject } from "rxjs";
import { JwtSignResult } from "./types";

export function createJwtModel(secret: string) {
  const events = new Subject<JwtSignResult>();

  function getEvents() {
    return events.asObservable();
  }

  async function process() {}

  //   function sign(cid: string);

  return {
    getEvents
  };
}
