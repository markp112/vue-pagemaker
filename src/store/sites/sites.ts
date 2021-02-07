import store from "@/store";
import {
  Module,
  Mutation,
  Action,
  VuexModule,
  getModule
} from "vuex-module-decorators";
import { Site, initSite } from "@/models/sites/site.ts";
import {
  Notification,
  notificationDefault
} from "@/models/notifications/notifications";
import firebase from "firebase";
import { AuthModule } from "../auth/auth";
import Guid from "@/utils/guid";

export interface SitesStateInterface {
  sites: Site[];
  _currentSiteId: string;
  _currentSite: Site;
}
@Module({ name: "sites", store, dynamic: true })
class SitesStore extends VuexModule implements SitesStateInterface {
  sites: Site[] = [];
  _currentSiteId = "";
  _currentSite: Site = initSite;

  @Mutation
  private addSiteToSites(site: Site): void {
    this.sites.push(site);
  }

  @Mutation
  private clearSites(): void {
    this.sites = [];
  }

  @Mutation
  private setCurrentSiteId(siteId: string) {
    this._currentSiteId = siteId;
  }

  @Mutation
  private setSite(site: Site) {
    const siteExists = this.sites.filter(s => s.name === site.name);
    if (siteExists.length > 0) {
      siteExists[0] = site;
    } else {
      this.sites.push(site);
    }
    this._currentSite = site;
  }

  @Action({ rawError: true })
  public saveSite(newSite: Site): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      newSite.userId = AuthModule.currentUser.id;
      if (newSite.siteId === "") {
        newSite.siteId = Guid.newGuid();
      }
      const documentId = `site::${newSite.siteId}`;
      const collectionId = this.getCollectionId;
      const firestore = firebase.firestore();
      firestore
        .collection(collectionId)
        .doc(documentId)
        .set(newSite)
        .then(() => {
          this.context.commit("setSite", newSite);
          resolve(notification);
        })
        .catch(err => {
          notification.status = "Error";
          notification.message = err;
          reject(notification);
        });
      resolve(notification);
    });
  }

  @Action({ rawError: true })
  public getSites(): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const collectionId = this.getCollectionId;
      const firestore = firebase.firestore();
      this.context.commit("clearSites");
      firestore
        .collection(collectionId)
        .get()
        .then(result => {
          result.forEach(doc => {
            const site: Site = doc.data() as Site;
            this.context.commit("addSiteToSites", site);
          });
          resolve(notification);
        });
    });
  }

  @Action({ rawError: true })
  public updateCurrentSiteId(siteId: string) {
    this.context.commit("setCurrentSiteId", siteId);
  }

  public get getListofSites(): Site[] {
    return this.sites;
  }

  public get getCollectionId(): string {
    if (AuthModule.currentUser.id) {
      return AuthModule.currentUser.id + "::sites";
    } else {
      return "";
    }
  }

  public get getCurrentSiteId(): string {
    return this._currentSiteId;
  }

  public get getCurrentSite(): Site {
    return this._currentSiteId !== ""
      ? this.sites.filter(site => site.siteId === this._currentSiteId)[0]
      : initSite;
  }
}

export const SitesModule = getModule(SitesStore);
