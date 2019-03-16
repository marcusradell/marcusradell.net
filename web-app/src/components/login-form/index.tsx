import React from "react";
import { Components } from "./types";
import { InputComponent } from "../input";
import { ValidationComponent } from "../validation";

export class LoginFormComponent {
  public components: Components;

  constructor() {
    const nickname = new InputComponent();
    const password = new InputComponent();

    const minNicknameLength = 6;
    const minPasswordLength = 12;

    this.components = {
      nickname,
      nicknameValidation: new ValidationComponent(
        s => s.data.length >= minNicknameLength,
        s =>
          `Nickname is ${
            s.data.length
          } characters and needs to be at least ${minNicknameLength}.`,
        nickname.stateStream
      ),
      password,
      passwordValidation: new ValidationComponent(
        s => s.data.length >= minPasswordLength,
        s =>
          `Password is currently ${
            s.data.length
          } characters and needs to be at least ${minPasswordLength}.`,
        password.stateStream
      )
    };
  }

  public createView() {
    const Nickname = this.components.nickname.createView("text");
    const NicknameValidation = this.components.nicknameValidation.createView();
    const Password = this.components.password.createView("password");
    const PasswordValidation = this.components.passwordValidation.createView();

    return () => {
      return (
        <form style={{ width: "500px" }}>
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
        </form>
      );
    };
  }
}
