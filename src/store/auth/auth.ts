
import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import { UserInterface, initUser, AuthStatus } from '@/models/user/user'
import firebase from 'firebase';
import { ErrorCodes } from '@/models/enums/errors/errors';

export interface UserStateInterface {
  user: UserInterface,
}

@Module({ name: 'authstore', store, dynamic: true })
class AuthStore extends VuexModule implements UserStateInterface {
  user: UserInterface = initUser;

  @Mutation 
  private setEmail(email: string): void {
    this.user.email = email;
  }

  @Mutation
  private setSignedIn(signedIn: boolean): void {
    this.user.signedIn = signedIn;
  }

  @Mutation
  private setId(id: string): void {
    this.user.id = id;
  }

  @Mutation
  private setUser(user: UserInterface): void {
    this.user = user;
  }

  @Action({ rawError: true, commit: 'setUser' }) 
  public registerUser(newUser: UserInterface):Promise<AuthStatus> {
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

  @Action({ commit: 'setUser' }) 
  public login(user: UserInterface) {
    const invalidPassword = "auth/wrong-password";
    const userNotFound = "auth/user-not-found";
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then (data => {
        if (data.user) {
            user.id = data.user.uid
            user.signedIn = true;
            user.refreshToken = data.user.refreshToken === undefined ? '' : data.user.refreshToken;
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

  @Action({ commit: 'setUser' }, )
  public getUserFromLocalStorage() {
    const user: UserInterface = initUser;
    const refreshToken = window.localStorage.getItem("pmToken");
    if(refreshToken !== null){
      const email  = window.localStorage.getItem("pmEmail");
      const id = window.localStorage.getItem("id");
      user.email = email === null ? '' : email;
      user.signedIn = true;
      user.id = id === null ? '' : id;
      user.refreshToken = refreshToken;
    }
    return user;
  }

  public get isUserLoggedIn(): boolean {
      return this.user.signedIn;
    }

  public get isExistingUser(): boolean {
      const refreshToken = window.localStorage.getItem("pmToken");
      console.log('%c⧭', 'color: #1d5673', refreshToken);
      // return false
      return refreshToken === null ? false : true;
    }

  public get currentUser(): UserInterface {
      return this.user;
    }
}

export const AuthModule = getModule(AuthStore);
