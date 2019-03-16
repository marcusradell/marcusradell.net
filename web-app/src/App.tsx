import React from "react";
import { LoginFormComponent } from "./components/login-form";

const loginFormComponent = new LoginFormComponent();
const LoginForm = loginFormComponent.createView();

(window as any).app = {
  loginFormComponent
};

export function App() {
  return (
    <div style={{ backgroundColor: "black" }}>
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh"
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
