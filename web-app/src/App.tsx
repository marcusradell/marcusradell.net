import React from "react";
import { LoginFormComponent } from "./components/login-form";

const loginFormComponent = new LoginFormComponent();
const LoginForm = loginFormComponent.createView();

(window as any).app = {
  loginFormComponent
};

export function App() {
  return (
    <>
      <LoginForm />
    </>
  );
}
