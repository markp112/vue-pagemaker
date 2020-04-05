import { Module, VuexModule,  Action, Mutation } from 'vuex-module-decorators'
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';
import { authStore } from '../store-accessors';


const notification: Notification = notificationDefault;

@Module({name: 'ServicesModule' })
export default class ServicesModule extends VuexModule {

  _percentComplete!: number;
  _dragDropEventHandled= false;

  @Mutation 
  updatePercentComplete(snapshot: firebase.storage.UploadTaskSnapshot) {
    this._percentComplete = (snapshot.bytesTransferred / snapshot.totalBytes) *100
  }

  @Mutation 
  setDragDropEventHandled(toggle: boolean) {
    this._dragDropEventHandled = toggle;
  }

  @Action({rawError: true})
  firestoreSaveFile(file: File): Promise<Notification> {
    const userId = authStore.currentUser.id;
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

  @Action({rawError: true}) 
  toggleDragDropEventHandled(toggle: boolean) {
    this.context.commit('setDragDropEventHandled', toggle)
  }

  get percentComplete (): number {
    return this._percentComplete;
  }

  get dragDropEventHandled(): boolean {
    return this._dragDropEventHandled
  }
}