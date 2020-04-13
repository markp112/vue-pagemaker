import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import { SnackbarMessage, initSnackbarMessage } from '@/models/notifications/snackbar.ts'


export interface SnackbarStateInterface {
  snackbar: SnackbarMessage,
}

@Module({ name: 'snackbar', store, dynamic: true })
class SnackbarStore extends VuexModule implements SnackbarStateInterface{
  snackbar = initSnackbarMessage;

  @Mutation
  private setSnackbar (snackbar: SnackbarMessage) {
    this.snackbar = snackbar;
  }

  @Mutation
  private hideSnackbar() {
    this.snackbar.show = false;
  }

  @Action({ commit: 'setSnackbar' })
  public showSnackbar(snackbar: SnackbarMessage){
    return snackbar;
  }

  @Action({ commit: 'hideSnackbar' })
  public hide(){
    return false;
  }

  public get snackbarMessage(): SnackbarMessage {
    console.log("SnackbarMessage Called")
    return this.snackbar === undefined ? initSnackbarMessage : this.snackbar;
  }
}

export const SnackbarModule = getModule(SnackbarStore);