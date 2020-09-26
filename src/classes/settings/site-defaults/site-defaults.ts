import { SiteDefaultsInterface, siteDefaultSettings, MaterialColourInterface, TypographyInterface } from '@/views/settings/pages/site-defaults/models/site-defaults';
import {  ServicesModule } from '@/store/services/services';
import { AuthModule } from '@/store/auth/auth';
import { SitesModule } from '@/store/sites/sites';
import { Notification } from '@/models/notifications/notifications';
import { SnackbarModule } from '@/store/snackbar/snackbar';
import { SnackbarMessage, SnackbarTypes } from '@/models/notifications/snackbar';

export class SiteDefaults implements SiteDefaultsInterface {
  private _colours: MaterialColourInterface = siteDefaultSettings.colours;
  private _typography: TypographyInterface = siteDefaultSettings.typography;
  private _isLoaded = false;
  
  private static instance: SiteDefaults;

  public static getInstance(): SiteDefaults {
    if (!SiteDefaults.instance) {
      SiteDefaults.instance = new SiteDefaults();
    }
    return SiteDefaults.instance;
  }

public get colours(): MaterialColourInterface {
  return this._colours;
}

public get typography(): TypographyInterface {
  return this._typography;
}

public get isLoaded(): boolean {
  return this._isLoaded;
}

public loadDefaults(siteId: string, userId: string) {
  const data = {
    userId: userId,
    siteId: siteId,
  }
  ServicesModule.firestoreGetSiteDefaultSettings(data)
  .then (response => {
    const siteDefaults = response as SiteDefaultsInterface;
    this._colours = siteDefaults.colours;
    this._typography = siteDefaults.typography;
    console.log('%c⧭', 'color: #f200e2', siteDefaults);
    this._isLoaded = true;
  })
  .catch(err => {
    const notification = err as Notification;
    const snackbarMessage: SnackbarMessage = {
      message: notification.message,
      title: "Could not retrieve site settings",
      show: true,
      duration: 3000,
      type: SnackbarTypes.Error
    }
    SnackbarModule.showSnackbar(snackbarMessage);
    this._colours = siteDefaultSettings.colours;
    this._typography = siteDefaultSettings.typography;
    this._isLoaded = false;
  })
}

  public saveDefaults() {
    const data = {
      siteDefaults: {
        colours: this._colours,
        typography: this._typography,
      },
      siteId: SitesModule.getCurrentSiteId,
      userId: AuthModule.currentUser.id,
    };
    return new Promise((resolve, reject) => {
      ServicesModule.firestoreSaveSiteDefaults(data)
        .then(notificaton => {
          resolve(notificaton);
        })
        .catch (notification => 
          reject(notification))
    })
  }

}


