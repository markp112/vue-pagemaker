import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import  AuthModule  from './auth/auth';
import  SiteModule  from './sites/sites';
import  NavMenuItemsModule  from './menus/nav-menu/nav-menu-module';
import SnackbarModule from './snackbar/snackbar';

export let authStore:  AuthModule;
export let siteStore: SiteModule;
export let navMenuStore: NavMenuItemsModule;
export let snackbarStore: SnackbarModule;


export function initialiseStore(store: Store<any>): void {
  authStore = getModule(AuthModule, store);
  siteStore = getModule(SiteModule, store);
  navMenuStore = getModule(NavMenuItemsModule, store);
  snackbarStore = getModule(SnackbarModule, store);

}

export const modules = { 
  'auth': AuthModule,
  'sites': SiteModule,
  'navMenuItems': NavMenuItemsModule,
  'snackbar' : SnackbarModule,
}