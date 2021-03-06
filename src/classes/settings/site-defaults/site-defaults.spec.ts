import { SiteDefaults } from './site-defaults';
import { SiteDefaultsInterface, siteDefaultSettings, MaterialColourInterface, TypographyInterface } from '@/views/settings/pages/site-defaults/models/site-defaults';
import { } from '@/store/'
import Firebase from 'firebase/app';
import  'firebase/firestore';
import { secrets } from '@/firebase/secrets';
import { AuthModule } from '@/store/auth/auth';
import { initUser, UserInterface } from '@/models/user/user';
import { SitesModule } from '@/store/sites/sites';

describe("SiteDefaults", () => {
  
  let siteDefaults: SiteDefaults;
  let user: UserInterface = initUser;

  const firebaseApp = Firebase.initializeApp(secrets.google);
  firebaseApp.firestore().settings({
    cacheSizeBytes: 4000000,
  });
  

  beforeAll(() => {

    user.email = 'testingvuepagemaker@maildrop.cc';
    user.password = secrets.testing.secret;
    console.debug("user", user.email, user.password)
    AuthModule.login(user)
      .then ( (firebaseUser => {
        const thisUser = firebaseUser as UserInterface;
        user.id = thisUser.id;
        user.signedIn = true;
      }))
      .catch((err => {
        console.debug("Error login in", err);
      }));
     SitesModule.updateCurrentSiteId('1');
  })
    
  beforeEach(() => {
    SitesModule.updateCurrentSiteId('1');
    siteDefaults = SiteDefaults.getInstance();
  })
  
  it("should when getInstance is called return an instance of SiteDefaults with default values", () => {
    
    expect(siteDefaults).not.toBe(null);
    expect(siteDefaults.colours).not.toBe(null);
    expect(siteDefaults.typography).not.toBe(null);
    expect(siteDefaults.colours.primary).toEqual('#323673');
    expect(siteDefaults.typography.fontName).toEqual('Roboto');

  })
  
  // it("Should when SaveDefaults is called create / update a record in Firebase",() => {
  //   return siteDefaults.saveDefaults(siteId, '2KHeQlrjMWN0FqOjXjApHWJ1SqF2')
  //   .then (response => {
  //     const notification: Notification = response as Notification;
  //     expect(notification.status).toEqual("ok");
  //     expect(notification.message).toEqual("Defaults Saved");
      
  //   })
  // }) 
})
