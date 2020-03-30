
import { Module, VuexModule, MutationAction, Mutation, Action } from 'vuex-module-decorators'
import {  Site,initSite } from '@/models/sites/site.ts';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase, { firestore } from 'firebase';
 import { authStore } from '../store-accessors';
import Guid from '@/utils/guid';

@Module({name: 'Sites' })
export default class SiteModule extends VuexModule {

  sites: Site[] = [];

  _currentSiteId!: string;
  _currentSite: Site = initSite;

  @Mutation addSiteToSites(site: Site): void {
    this.sites.push(site);
  }

  @Mutation clearSites(): void {
    this.sites = [];
  }

  @Mutation setCurrentSiteId(siteId: string) {
    this._currentSiteId = siteId
  }

  @Mutation setSite(site: Site) {
    const siteExists = this.sites.filter(s => s.name === site.name);
    if (siteExists.length > 0) {
      siteExists[0] = site;
    } else {
      this.sites.push(site);
    }
    this._currentSite = site;
  }

  @Action({rawError: true})
  saveSite(newSite: Site): Promise<Notification>
  {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject ) => {
      newSite.userId = authStore.currentUser.id;
      if (newSite.siteId === '') {
        newSite.siteId = Guid.newGuid();
      }
      console.log("site", newSite)
      const documentId = `site::${newSite.siteId}`;
      const collectionId = this.getCollectionId;
      const firestore = firebase.firestore();
      firestore.collection(collectionId).doc(documentId).set(newSite)
      .then ( () => {
        this.context.commit('setSite', newSite)
        resolve(notification);
      })
      .catch ((err) => {
        notification.status = "Error";
        notification.message = err;
        reject(notification);
      })
      resolve(notification)
    })
  }

  @Action({rawError: true})
  getSites(): Promise<Notification>  {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const collectionId = this.getCollectionId;
      const firestore = firebase.firestore();
      this.context.commit('clearSites')
      firestore.collection(collectionId).get()
      .then (result => {
        result.forEach(doc =>{
          const site: Site = doc.data() as Site;
          this.context.commit('addSiteToSites', site);
        })
        resolve(notification);
      })
    })
  }

  @Action({rawError: true})
  updateCurrentSiteId(siteId: string) {
    this.context.commit('setCurrentSiteId', siteId)
  }

  get getListofSites(): Site[] {
    return this.sites;
  }

  get getCollectionId():string {
    if(authStore.currentUser.id) {
    return  authStore.currentUser.id + '::sites';
    } else {return ''}
  }

  get getCurrentSiteId():string {
    return this._currentSiteId
  }

  get getCurrentSite():Site {
    return this._currentSiteId !=='' ? this.sites.filter(site => site.siteId === this._currentSiteId)[0] : initSite;
  }

}

