import React from "react";
import { LoginFormComponent } from "./components/login-form";

export class AppComponent {
  public loginFormComponent: LoginFormComponent;

  constructor() {
    this.loginFormComponent = new LoginFormComponent();
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
