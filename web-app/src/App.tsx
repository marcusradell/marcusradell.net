import React from "react";
import { LoginFormComponent } from "./modules/login-form";
import { IWs } from "./services/ws";

export class AppComponent {
  public loginFormComponent: LoginFormComponent;

  constructor(ws: IWs) {
    this.loginFormComponent = new LoginFormComponent(ws);
  }

  public createView() {
    const LoginForm = this.loginFormComponent.createView();

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
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
