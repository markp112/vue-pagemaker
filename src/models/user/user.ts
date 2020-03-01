export  interface  UserInterface {
  email: string;
  signedIn: boolean;
  id: string;
  password: string;
}

export const initUser: UserInterface = {
  email: "",
  signedIn: false,
  id: "",
  password:"",
  }