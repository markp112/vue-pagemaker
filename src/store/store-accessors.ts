import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import  AuthModule  from './auth/auth';
import  SiteModule  from './sites/sites';
import  NavMenuItemsModule  from './menus/nav-menu/nav-menu-module';
import  SnackbarModule from './snackbar/snackbar';
import SidebarModule from './sidebar/sidebar';
import ComponentProps from './component-props/component-props';
import PageModule from './pages/pages';


export let authStore:  AuthModule;
export let siteStore: SiteModule;
export let navMenuStore: NavMenuItemsModule;
export let snackbarStore: SnackbarModule;
export let sidebarStore: SidebarModule;
export let componentProps: ComponentProps;
export let pageStore: PageModule;

export function initialiseStore(store: Store<any>): void {
  authStore = getModule(AuthModule, store);
  siteStore = getModule(SiteModule, store);
  navMenuStore = getModule(NavMenuItemsModule, store);
  snackbarStore = getModule(SnackbarModule, store);
  sidebarStore = getModule(SidebarModule, store);
  componentProps = getModule(ComponentProps, store);
  pageStore = getModule(PageModule, store);
}

export const modules = { 
  'auth': AuthModule,
  'sites': SiteModule,
  'navMenuItems': NavMenuItemsModule,
  'snackbar' : SnackbarModule,
  'sidebar': SidebarModule,
  'componentprops': ComponentProps,
  'pages': PageModule,
}