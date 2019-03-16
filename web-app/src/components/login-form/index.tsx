import React from "react";
import { Components } from "./types";
import { InputComponent } from "../input";
import { ValidationComponent } from "../validation";

export class LoginFormComponent {
  public components: Components;

  constructor() {
    const nickname = new InputComponent();

    this.components = {
      nickname,
      nicknameValidation: new ValidationComponent(nickname.stateStream),
      password: new InputComponent()
    };
  }

  public createView() {
    const Nickname = this.components.nickname.createView();
    const NicknameValidation = this.components.nicknameValidation.createView();
    const Password = this.components.password.createView();

    return () => {
      return (
        <form>
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <Nickname />
            <div>
              <NicknameValidation />
            </div>
            <label htmlFor="password">Password</label>
            <Password />
          </div>
        </form>
      );
    };
  }
}
