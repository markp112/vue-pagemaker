import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase, { auth, firestore } from 'firebase';
import { AuthModule } from '../auth/auth';
import { siteDefaultSettings, SiteDefaultsInterface } from '@/views/settings/pages/site-defaults/models/site-defaults';
import { PalettesInterface } from '@/classes/settings/colour-palette/colour-palette';
import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';
import { SiteAndUserId } from '@/classes/site-and-user/SiteAndUserId';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';

export interface ServicesStateInterface {
  _percentComplete?: number,
  _dragDropEventHandled: boolean,
}
const notification: Notification = notificationDefault;

@Module({ name: 'services-module', dynamic: true, store })
class ServicesStore extends VuexModule implements ServicesStateInterface {
  SETTINGS = '::settings';
  PALETTE = 'siteColourPalette';
  SITE_SETTINGS = 'siteSettings';
  collectionId = '';
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

  @Mutation
  private setCollectionId(collectionId: string) {
    this.collectionId = collectionId;
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
  //#region Palettes
  
  @Action 
  public firestoreSaveColourPalette(data: {
    siteAndUserId: SiteIdAndUserId,
    colourPalette: PalettesInterface,
  }): Promise<Notification> {
    const siteAndUserId: SiteAndUserId = new SiteAndUserId(data.siteAndUserId);
    if (siteAndUserId.validate()) { 
      return new Promise((resolve, reject) => {
        const firestore = firebase.firestore();
        this.context.commit('setCollectionId', `${data.siteAndUserId.userId}${data.siteAndUserId.siteId}${this.SETTINGS}`);
        firestore.collection(this.collectionId).doc(this.PALETTE).set(data.colourPalette)
        .then(() => {
          notification.message = "Palettes saved";
          notification.status = "ok";
          resolve(notification);
        })
        .catch(err => {
          console.log("err")
          notification.status = "Error";
          notification.message = err;
          reject(notification);
        });
      })
    } else {
      return new Promise((reject) => {
        notification.status = "Error";
        notification.message = "Missing attributes";
        reject(notification);
      })
    }

  }

  @Action
  public firestoreLoadSitePalette(siteIdAndUserId: SiteIdAndUserId): Promise<PalettesInterface | Notification> {
    const siteAndUserId: SiteAndUserId = new SiteAndUserId(siteIdAndUserId);
    if(siteAndUserId.validate()) {
      const collectionId = `${siteIdAndUserId.userId}${siteIdAndUserId.siteId}${this.SETTINGS}`;
      return new Promise((resolve, reject) => {
        const firestore = firebase.firestore();
        firestore.collection(collectionId).doc(this.PALETTE).get()
          .then (response => {
            const docData = response.data();
            resolve(docData as PalettesInterface);
          })
          .catch (err => {
            reject(err);
          })
      });
    } else {
      return new Promise((reject) => {
        notification.status = "Error";
        notification.message = "Missing attributes";
        reject(notification);
      })
    }
  }

//#endregion
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
      const collectionId = `${userId}${siteId}${this.SETTINGS}`;
      const firestore = firebase.firestore();
      firestore.collection(collectionId)
        .doc(this.SITE_SETTINGS)
        .set(siteDefaultsPlusSiteAnduserId.siteDefaults)
      .then(() => {
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
      this.context.commit('setCollectionId', `${data.userId}${data.siteId}${this.SETTINGS}`);
      const firestore = firebase.firestore();
      firestore.collection(this.collectionId).doc('siteSettings').get()
        .then (response => {
          const docData = response.data();
          console.log('%c⧭', 'color: #00bf00', response.data());
          siteDefaults = docData !== undefined ? docData as SiteDefaultsInterface : siteDefaultSettings;
          console.log('%c⧭', 'color: #917399', siteDefaults, "site defaults response");
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
