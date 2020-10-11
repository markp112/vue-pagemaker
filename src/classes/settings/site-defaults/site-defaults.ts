import {
  SiteDefaultsInterface,
  siteDefaultSettings,
  MaterialColourInterface,
  TypographyInterface,
} from '@/views/settings/pages/site-defaults/models/site-defaults';
import { ServicesModule } from '@/store/services/services';
import { AuthModule } from '@/store/auth/auth';
import { Notification } from '@/models/notifications/notifications';

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

  public loadDefaults(siteId: string, userId: string):Promise<Notification> {
    const data = {
      userId: userId,
      siteId: siteId,
    }
    return new Promise((resolve, reject) => {
      ServicesModule.firestoreGetSiteDefaultSettings(data)
      .then (response => {
        const siteDefaults: SiteDefaultsInterface = response as SiteDefaultsInterface;
        this._colours = siteDefaults.colours;
        this._typography = siteDefaults.typography;
        this._isLoaded = true;
        const notification: Notification = {
          message: 'Sucess',
          status: 'ok',
        }
        resolve(notification)
      })
      .catch(err => {
        const notification = err as Notification;
        notification.status = 'Error';
        // if error load the default settings
        this._colours = siteDefaultSettings.colours;
        this._typography = siteDefaultSettings.typography;
        this._isLoaded = false;
        reject(notification);
      })
    })
  }

  public saveDefaults(siteId: string, userId: string) {
    const data = {
      siteDefaults: {
        colours: this._colours,
        typography: this._typography,
      },
      siteId: siteId,
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


