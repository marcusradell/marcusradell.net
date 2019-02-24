import React, { useEffect } from "react";
import { Components } from "./types";
import { InputComponent } from "../input";
import { combineLatest } from "rxjs/operators";

export class LoginFormComponent {
  components: Components;

  constructor() {
    this.components = {
      nickname: new InputComponent(),
      password: new InputComponent()
    };
  }

  public createView() {
    const Nickname = this.components.nickname.createView();
    const Password = this.components.password.createView();

    // this.components.nickname.machineState
    //   .pipe(
    //     combineLatest(
    //       this.components.password.machineState,
    //       (nickname, password) => ({
    //         nickname,
    //         password
    //       })
    //     )
    //   )
    //   .forEach(state => {
    //     console.log(state);
    //   });

    return () => {
      return (
        <form>
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <Nickname />
            <label htmlFor="password">Password</label>
            <Password />
          </div>
        </form>
      );
    };
  }
}
