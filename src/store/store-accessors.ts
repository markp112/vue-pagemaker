import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import  AuthModule  from './auth/auth';
import  SiteModule  from './sites/sites';
import  NavMenuItemsModule  from './menus/nav-menu/nav-menu-module';
import  SnackbarModule from './snackbar/snackbar';
import SidebarModule from './sidebar/sidebar';
import ComponentProps from './component-props/component-props';
import PagesModule from './pages/pages';
import ServicesModule from './services/services';
import pageModule from './page/page';
import PageModule from './page/page';

export let authStore:  AuthModule;
export let siteStore: SiteModule;
export let navMenuStore: NavMenuItemsModule;
export let snackbarStore: SnackbarModule;
export let sidebarStore: SidebarModule;
export let componentProps: ComponentProps;
export let pagesStore: PagesModule;
export let servicesStore: ServicesModule;
export let pageStore: PageModule;

export function initialiseStore(store: Store<any>): void {
  authStore = getModule(AuthModule, store);
  siteStore = getModule(SiteModule, store);
  navMenuStore = getModule(NavMenuItemsModule, store);
  snackbarStore = getModule(SnackbarModule, store);
  sidebarStore = getModule(SidebarModule, store);
  componentProps = getModule(ComponentProps, store);
  pagesStore = getModule(PagesModule, store);
  servicesStore = getModule(ServicesModule, store);
  pageStore = getModule(PageModule,store);
}

export const modules = { 
  'auth': AuthModule,
  'sites': SiteModule,
  'navMenuItems': NavMenuItemsModule,
  'snackbar' : SnackbarModule,
  'sidebar': SidebarModule,
  'componentprops': ComponentProps,
  'pages': PagesModule,
  'services': ServicesModule,
  'page': PageModule,
}