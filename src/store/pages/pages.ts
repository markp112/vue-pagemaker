import { Module, VuexModule, MutationAction, Mutation, Action } from 'vuex-module-decorators'
import {  Page } from '@/models/pages/pages.ts';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';
import { authStore, siteStore } from '../store-accessors';



@Module({name: 'pageModule' })
export default class PageModule extends VuexModule {

  pages: Page[] = [];
  _currentPage: Page = new Page();
 
  
  @Mutation addPage(page: Page){
    this.pages.push(page)
  }

  @Mutation clear(){
    this.pages = []
  }

  @Mutation setCurrentPage(page: Page) {
    this._currentPage = page
  }
  
  @Action({rawError: true})
  saveThePage(page: Page): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const collectionId = this.getPageCollectionId;
      const data = page.getPageDataAsObject();
      firestore.collection(collectionId).doc(page.name).set(data)
      .then(() => {
        console.log('saved to firebase', notification)
        this.context.commit('setCurrentPage', page);
        this.context.commit('addPage', page);
        resolve(notification);
      })
      .catch(err => {
        notification.status = "Error";
        notification.message = err;
        reject(notification);
      })
    })
  }

  @Action({rawError: true})
  loadPages(): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const collectionId = this.getPageCollectionId;
      this.context.commit('clear');
      firestore.collection(collectionId).get()
      .then (collection => {
        collection.forEach(doc => {
          const page:Page = doc.data() as Page;
          this.context.commit('addPage', page);
        })
        resolve(notification);
      })
      .catch(err => {
        notification.status = "Error";
        notification.message = err;
      })
    })
  }

  get pageList(): Page[] {
    return this.pages
  }

  get getCurrentPage(): Page {
    return this._currentPage
  }

  get getPageCollectionId(): string {
    if(authStore.currentUser.id) {
      return  authStore.currentUser.id + siteStore.getCurrentSiteId + '::pages';
      } else {return ''}
  }

  
}