import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase, { auth } from 'firebase';
// import { authStore } from '../store-accessors';
import { AuthModule } from '../auth/auth';
import { SiteDefaultsInterface } from '@/views/settings/pages/site-defaults/models/site-defaults';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';

export interface ServicesStateInterface {
  _percentComplete?: number,
  _dragDropEventHandled: boolean,
}

const notification: Notification = notificationDefault;
const SETTINGS = '::settings'
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
  
  @Action 



  @Action({ rawError: true }) 
  public toggleDragDropEventHandled(toggle: boolean) {
    this.context.commit('setDragDropEventHandled', toggle)
  }

  @Action({ rawError: true })
  public firestoreSaveSiteDefaults(siteDefaultsPlusSiteAnduserId: {
    siteDefaults: SiteDefaultsInterface,
    siteId: string,
    userId: string,
  }): Promise<Notification> {
    const ERROR_MESSAGE = "FirestoreSaveSiteDefaults:";
    if (!siteDefaultsPlusSiteAnduserId) throw new Error(`${ERROR_MESSAGE} missing data`);
    const siteId = siteDefaultsPlusSiteAnduserId.siteId;
    if (!siteId) throw new Error(`${ERROR_MESSAGE} siteId missing cannot be blank`);
    const userId = siteDefaultsPlusSiteAnduserId.userId;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const collectionId = `${userId}${siteId}${SETTINGS}`;
      firestore.collection(collectionId).doc("siteSettings").set(siteDefaultsPlusSiteAnduserId)
      .then(response => {
        //update the site defaults
        notification.message = "Defaults saved";
        notification.status = "ok";
        resolve(notification);
      })
      .catch(err => {
        notification.status = "Error";
        notification.message = err;
        reject(notification);
     
      });
    }
  )}

  @Action({ rawError: true })
  public firestoreGetSiteDefaultSettings(data: { userId: string, siteId : string }): Promise<SiteDefaultsInterface | Notification>  {
    let siteDefaults: SiteDefaultsInterface;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const collectionId = `${data.userId}${data.siteId}${SETTINGS}`;
      firestore.collection(collectionId).get()
        .then (response => {
          const docData =response.docs[0].data();
          siteDefaults = docData.siteDefaults as SiteDefaultsInterface;
          resolve(siteDefaults);
        })
        .catch( err => {
          notification.status = "Error";
          notification.message = err;
          reject(notification)
        })
    })
  }

  public get percentComplete (): number {
    return this._percentComplete;
  }

  public get dragDropEventHandled(): boolean {
    return this._dragDropEventHandled
  }
}

export const ServicesModule = getModule(ServicesStore);