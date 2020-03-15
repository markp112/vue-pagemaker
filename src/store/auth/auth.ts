import { Module, VuexModule,  Mutation, Action} from 'vuex-module-decorators';
import { UserInterface, initUser, AuthStatus } from '@/models/user/user'
import firebase from 'firebase';
import { ErrorCodes } from '@/models/enums/errors/errors';


@Module
export default class AuthModule extends VuexModule {
  user: UserInterface = initUser;

  @Mutation 
  setEmail(email: string): void {
    this.user.email = email;
  }

  @Mutation
  setSignedIn(signedIn: boolean): void {
    this.user.signedIn = signedIn;
  }

  @Mutation
  setId(id: string): void {
    this.user.id = id;
  }

  @Mutation
  setUser(user: UserInterface): void {
    console.log("user set", user);
    this.user = user;
    console.log("This.user", this.user);
  }

  @Action({rawError: true, commit: 'setUser'}) 
  registerUser(newUser: UserInterface):Promise<AuthStatus> {
    let authStatus: AuthStatus
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            
            authStatus = {
            isSuccess: true,
            errorCode: ErrorCodes.NotSet,
          }
          resolve(authStatus);
        })
        .catch(err => {
          console.log(err);
          authStatus = {
            isSuccess: false,
            errorCode: ErrorCodes.RegistrationFailed
          }
          reject(authStatus);
        })
    })
  }

  @Action({ commit: 'setUser'}) 
  login(user: UserInterface) {
    const invalidPassword = "auth/wrong-password";
    const userNotFound = "auth/user-not-found";
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then (data => {
        if (data.user) {
          user.id = data.user.uid
            user.signedIn = true;
            user.refreshToken = data.user.refreshToken;
            window.localStorage.setItem("pmToken", user.refreshToken);
            window.localStorage.setItem("pmEmail", user.email);
            window.localStorage.setItem("id", user.id);
            resolve(user);
          }
        })
      .catch(err => {
        if (err.code === invalidPassword || err.code === userNotFound) {
          reject (ErrorCodes.LoginFailed);
        }
      })
    })
  }

@Action({commit: 'setUser'}, )
getUserFromLocalStorage() {
  
  const user: UserInterface = initUser;
  const refreshToken = window.localStorage.getItem("pmToken");
  console.log('%c%s', 'color: #9c501d', refreshToken, ':Token');
  if(refreshToken !== null){
    console.log("came here")
    const email  = window.localStorage.getItem("pmEmail");
    const id = window.localStorage.getItem("id");
    user.email = email === null ? '' : email;
    user.signedIn = true;
    user.id = id === null ? '' : id;
    user.refreshToken = refreshToken;
    console.log('%c%s', 'color: #00e600', user);
  }
  return user;
}

  get isUserLoggedIn(): boolean {
    return this.user.signedIn;
  }

  get isExistingUser(): boolean {
    const refreshToken = window.localStorage.getItem("pmToken");
    return refreshToken === null ? false : true;
  }

  
}


