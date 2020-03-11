import { ErrorCodes } from '../enums/errors/errors'

export  interface  UserInterface {
  email: string;
  signedIn: boolean;
  id: string;
  password: string;
  refreshToken?: string;
}

export interface AuthStatus {
  isSuccess: boolean;
  errorCode: ErrorCodes;

}

export const initUser: UserInterface = {
  email: "",
  signedIn: false,
  id: "",
  password:"",
  }

  export const initAuthStatus: AuthStatus = {
    isSuccess: false,
    errorCode: ErrorCodes.Undefined,

  }