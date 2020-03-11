import { Module, VuexModule, MutationAction, Mutation, Action} from 'vuex-module-decorators';
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
  }

  @Action({rawError: true, commit: 'setUser'}) registerUser(newUser: UserInterface):Promise<AuthStatus> {
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

  @Action({rawError: true, commit: 'setUser'}) login(user: UserInterface) {
    const invalidPassword = "auth/wrong-password";
    const userNotFound = "auth/user-not-found";
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then (data => {
        console.log("data", data)
        if (data.user) {
          console.log("data.user", data.user)
            user.id = data.user.uid
            user.signedIn = true;
            user.refreshToken = data.user.refreshToken;
            console.log("Setuser about to be called")
            this.context.commit('setUser',user);
        }
        console.log("Resolving promise")
        resolve();
      })
      .catch(err => {
        if (err.code === invalidPassword || err.code === userNotFound) {
          reject (ErrorCodes.LoginFailed);
        }
      })
    })
  }

  get isUserLoggedIn(): boolean {
    return this.user.signedIn;
  }
}