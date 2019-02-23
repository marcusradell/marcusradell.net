import React, { useReducer } from "react";
import { InputComponent } from "./components/input";

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

const inputComponent = new InputComponent();
const Input = inputComponent.getView();

export function App() {
  return (
    <>
      <Input />
    </>
  );
}
