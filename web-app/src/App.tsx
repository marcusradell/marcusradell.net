import React, { useReducer } from "react";

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

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "set_value",
      payload: e.target.value
    });
  }

  return (
    <>
      <input value={state.value} onChange={onChange} />
      {JSON.stringify(state)}
    </>
  );
}
