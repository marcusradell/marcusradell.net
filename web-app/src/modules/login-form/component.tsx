import React, { useEffect } from "react";
import { Components } from "./types";
import { InputComponent } from "../input/component";
import { SubmitButtonComponent } from "../submit-button";
import { combineLatest } from "rxjs";
import { withLatestFrom, map } from "rxjs/operators";
import { IWs } from "../../services/ws";

const minNicknameLength = 6;
const minPasswordLength = 12;

export class LoginFormComponent {
  public components: Components;
  private ws: IWs;

  constructor(ws: IWs) {
    const nickname = new InputComponent(
      s => s.ctx.length >= minNicknameLength,
      s =>
        `Nickname is ${
          s.ctx.length
        } characters and needs to be at least ${minNicknameLength}.`,
      "text"
    );

    const password = new InputComponent(
      s => s.ctx.length >= minPasswordLength,
      s =>
        `Password is currently ${
          s.ctx.length
        } characters and needs to be at least ${minPasswordLength}.`,
      "password"
    );

    const validStream = combineLatest(
      nickname.validationModule.rxm.store,
      password.validationModule.rxm.store
    ).pipe(map(stores => stores.every(s => s.state === "valid")));

    const submitButton = new SubmitButtonComponent(validStream);

    this.components = {
      nickname,

      password,

      submitButton
    };
    this.ws = ws;
  }

  public createView() {
    const Nickname = this.components.nickname.createView();
    const Password = this.components.password.createView();
    const SubmitButton = this.components.submitButton.createView();

    return () => {
      useEffect(() => {
        const subscription = this.components.submitButton.rxm.store
          .pipe(
            withLatestFrom(
              this.components.nickname.rxm.store,
              this.components.password.rxm.store,
              (submitStore, nicknameStore, passwordStore) => ({
                submitStore: submitStore,
                formCtx: {
                  nickname: nicknameStore.ctx,
                  password: passwordStore.ctx
                }
              })
            )
          )
          .subscribe(store => {
            if (store.submitStore.state !== "submitting") return;

            this.ws.publish("auth#login", store.formCtx);

            // @TODO: Reason about the possible race condition where we have not yet updated our state to be "submitting" yet.
            this.components.submitButton.rxm.machine.submitting.done.trigger();
          });
        return () => {
          subscription.unsubscribe();
        };
      }, []);

      return (
        <div>
          <p className="text-info">
            If you don't have a login, a new one will be created for you the
            first time.
          </p>
          <form>
            <div className="form-group">
              <label htmlFor="nickname">Nickname</label>
              <Nickname />
              <label htmlFor="password">Password</label>
              <Password />
            </div>
            <div className="form-group text-right">
              <SubmitButton />
            </div>
          </form>
        </div>
      );
    };
  }
}
