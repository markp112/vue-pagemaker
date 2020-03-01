import { Module, VuexModule, MutationAction, Mutation, Action} from 'vuex-module-decorators';
import { UserInterface, initUser } from '@/models/user/user'
import firebase from 'firebase';


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
  setUser(user:UserInterface): void {
    this.user = user;
  }

  @Action({rawError:true, commit:'setUser'}) registerUser(newUser: UserInterface){
    console.log("In action")
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(data => {
        console.log("data", data)
        
      })
      .catch(err => {
        console.log(err)
      })

  }

}