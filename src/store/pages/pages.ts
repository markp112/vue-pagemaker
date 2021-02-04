
import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import {  Page } from '@/models/pages/pages.ts';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';
// import { authStore, siteStore } from '../store-accessors';
import { AuthModule } from '../auth/auth'
import { SitesModule } from '../sites/sites'
import { convertTimeStampDate } from '@/models/Types/generic-types';
import { PageStateInterface } from '../page/page';

export interface PagesStateInterface {
  pages: Page[],
  _currentPage: Page,
}

@Module({ name: 'pages-store', store, dynamic: true })
class PagesStore extends VuexModule implements PagesStateInterface {

  pages: Page[] = [];
  _currentPage: Page = new Page();
  
  @Mutation
  private addPage(page: Page){
    this.pages.push(page)
  }

  @Mutation
  private clear(){
    this.pages = []
  }

  @Mutation
  private setCurrentPage(page: Page) {
    this._currentPage = page
  }
  
  @Action({ rawError: true })
  public updateCurrentPage(name: string) {
    const page:Page = this.pageList.filter(pg => pg.name === name)[0];
    this.context.commit('setCurrentPage', page);
  }

  @Action({ rawError: true })
  public saveThePage(page: Page): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const collectionId = this.getPageCollectionId;
      const data = page.getPageDataAsObject();
      firestore.collection(collectionId).doc(page.name).set(data)
      .then(() => {
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

  @Action({ rawError: true })
  public loadPages(): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const collectionId = this.getPageCollectionId;
      this.context.commit('clear');
      firestore.collection(collectionId).get()
      .then (collection => {
        collection.forEach(doc => {
          const page:Page = doc.data() as Page;
          page.created = convertTimeStampDate(page.created);
          page.edited = convertTimeStampDate(page.edited);
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



  public get pageList(): Page[] {
    return this.pages
  }

  public get getCurrentPage(): Page {
    return this._currentPage
  }

  public get getPageCollectionId(): string {
    if(AuthModule.currentUser.id) {
      return  AuthModule.currentUser.id + SitesModule.getCurrentSiteId + '::pages';
      } else {return ''}
  }
}

export const PagesModule = getModule(PagesStore);