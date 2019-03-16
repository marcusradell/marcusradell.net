import { InputComponent } from "../input";
import { ValidationComponent } from "../validation";
import { SubmitButtonComponent } from "../submit-button";

export type Components = {
  nickname: InputComponent;
  nicknameValidation: ValidationComponent;
  password: InputComponent;
  passwordValidation: ValidationComponent;
  submitButton: SubmitButtonComponent;
};
