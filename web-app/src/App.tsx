import React from "react";
// import { LoginFormComponent } from "./components/login-form";
import { InputComponent, Store } from "./components/input";
import { IWs } from "./services/ws";

export class AppComponent {
  // public loginFormComponent: LoginFormComponent;
  public inputComponent: InputComponent;

  constructor(ws: IWs) {
    // this.loginFormComponent = new LoginFormComponent(ws);
    this.inputComponent = new InputComponent(
      (s: Store) => !!s.ctx,
      (s: Store) => "Invalid"
    );
  }

  public createView() {
    // const LoginForm = this.loginFormComponent.createView();
    const Input = this.inputComponent.createView("text");

    return () => (
      <div
        style={{
          backgroundColor: "black",
          backgroundImage: "linear-gradient(to bottom right, pink, steelblue)"
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            maxWidth: "500px"
          }}
        >
          <div className="card">
            <div className="card-header">
              <h1>Login</h1>
            </div>
            <div className="card-body">
              {/* <LoginForm /> */}
              <Input />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
