import React from "react";
import { LoginFormComponent } from "./components/login-form";

type State = {
  value: string;
};

type Action = {
  type: string;
  payload: string;
};

const initialState: State = {
  value: ""
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "set_value":
      return { ...state, value: action.payload };
    default:
      throw new Error("No such action type.");
  }
}

const loginFormComponent = new LoginFormComponent();
const LoginForm = loginFormComponent.createView();

export function App() {
  return (
    <>
      <LoginForm />
    </>
  );
}
