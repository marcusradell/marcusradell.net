import { InputComponent } from "../input/component";

export type Components<SubmitButtonComponent> = {
  nickname: InputComponent;
  password: InputComponent;
  submitButton: SubmitButtonComponent;
};
