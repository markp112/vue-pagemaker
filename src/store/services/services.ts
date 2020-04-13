import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';
// import { authStore } from '../store-accessors';
import { AuthModule } from '../auth/auth';

export interface ServicesStateInterface {
  _percentComplete?: number,
  _dragDropEventHandled: boolean,
}

const notification: Notification = notificationDefault;

@Module({ name: 'services-module', dynamic: true, store })
class ServicesStore extends VuexModule implements ServicesStateInterface {

  _percentComplete!: number;
  _dragDropEventHandled = false;

  @Mutation 
  private updatePercentComplete(snapshot: firebase.storage.UploadTaskSnapshot) {
    this._percentComplete = (snapshot.bytesTransferred / snapshot.totalBytes) *100
  }

  @Mutation 
  private setDragDropEventHandled(toggle: boolean) {
    this._dragDropEventHandled = toggle;
  }

  @Action({ rawError: true })
  public firestoreSaveFile(file: File): Promise<Notification> {
    const userId = AuthModule.currentUser.id;
    const path = `${userId}/images/`;
    const fileStore = firebase.storage().ref(`${path}${file.name}`);
    return new Promise((resolve, reject) => {
      const task = fileStore.put(file)
      task.on('state_changed', (snapshot) => {
        this.context.commit('updatePercentComplete', snapshot)
      });
      task.then(result => {
        fileStore.getDownloadURL()
        .then(url => {
          notification.message = url;
          resolve(notification)
        })
      })
      task.catch(err =>{
        notification.status = "Error";
        notification.message = err.message;
        reject(notification);
      })
  
    })
  }

  @Action({ rawError: true }) 
  public toggleDragDropEventHandled(toggle: boolean) {
    this.context.commit('setDragDropEventHandled', toggle)
  }

  public get percentComplete (): number {
    return this._percentComplete;
  }

  public get dragDropEventHandled(): boolean {
    return this._dragDropEventHandled
  }
}

export const ServicesModule = getModule(ServicesStore);