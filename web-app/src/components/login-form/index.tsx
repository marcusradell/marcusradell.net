import React, { useEffect } from "react";
import { Components } from "./types";
import { InputComponent } from "../input";
import { ValidationComponent } from "../validation";
import { SubmitButtonComponent } from "../submit-button";
import { MachineStates } from "../submit-button/types";
import { withLatestFrom } from "rxjs/operators";

export class LoginFormComponent {
  public components: Components;

  constructor() {
    const nickname = new InputComponent();
    const password = new InputComponent();

    const minNicknameLength = 6;
    const minPasswordLength = 12;

    const nicknameValidation = new ValidationComponent(
      s => s.data.length >= minNicknameLength,
      s =>
        `Nickname is ${
          s.data.length
        } characters and needs to be at least ${minNicknameLength}.`,
      nickname.stateStream
    );

    const passwordValidation = new ValidationComponent(
      s => s.data.length >= minPasswordLength,
      s =>
        `Password is currently ${
          s.data.length
        } characters and needs to be at least ${minPasswordLength}.`,
      password.stateStream
    );

    const submitButton = new SubmitButtonComponent([
      nicknameValidation,
      passwordValidation
    ]);

    this.components = {
      nickname,
      nicknameValidation,
      password,
      passwordValidation,
      submitButton
    };
  }

  public createView() {
    const Nickname = this.components.nickname.createView("text");
    const NicknameValidation = this.components.nicknameValidation.createView();
    const Password = this.components.password.createView("password");
    const PasswordValidation = this.components.passwordValidation.createView();
    const SubmitButton = this.components.submitButton.createView();

    return () => {
      useEffect(() => {
        const subscription = this.components.submitButton.stateStream
          .pipe(
            withLatestFrom(
              this.components.nickname.stateStream,
              this.components.password.stateStream,
              (submitState, nickname, password) => ({
                submitState,
                formState: {
                  nickname,
                  password
                }
              })
            )
          )
          .subscribe(state => {
            if (state.submitState.machine === MachineStates.Submitting) {
              Promise.resolve(state.formState).then(() => {
                this.components.submitButton.machine[
                  MachineStates.Submitting
                ].actions.done.trigger();
              });
            }
          });
        return () => {};
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
              <div>
                <NicknameValidation />
              </div>
              <label htmlFor="password">Password</label>
              <Password />
              <PasswordValidation />
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
