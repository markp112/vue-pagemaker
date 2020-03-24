import { Module, VuexModule, MutationAction, Mutation, Action } from 'vuex-module-decorators'
import { SnackbarMessage, initSnackbarMessage } from '@/models/notifications/snackbar.ts'

@Module({name: 'snackbar' })
export default class SnackbarModule extends VuexModule {
  snackbar = initSnackbarMessage;

  @Mutation
  setSnackbar (snackbar: SnackbarMessage) {
    this.snackbar = snackbar;
  }

  @Mutation
  hideSnackbar() {
    this.snackbar.show = false;
  }

  @Action({commit: 'setSnackbar'})
  showSnackbar(snackbar: SnackbarMessage){
    return snackbar;
  }

  @Action({commit: 'hideSnackbar'})
  hide(){
    return false;
  }

  get snackbarMessage(): SnackbarMessage {
    console.log("SnackbarMessage Called")
    return this.snackbar === undefined ? initSnackbarMessage : this.snackbar;
  }
}