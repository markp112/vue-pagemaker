import Vue from 'vue';
import Vuex , { Store } from 'vuex';
// import { initialiseStore, modules } from './store-accessors';
import { UserStateInterface } from './auth/auth';
import { ComponentPropsStateInterface } from './component-props/component-props';
import { NavMenuStateInterface } from './menus/nav-menu/nav-menu-module';
import { PageStateInterface } from './page/page';
import { PagesStateInterface } from './pages/pages';
import { ServicesStateInterface } from './services/services';
import { SidebarStateInterface } from './sidebar/sidebar';
import { SitesStateInterface } from './sites/sites';
import { SnackbarStateInterface } from './snackbar/snackbar';

Vue.use(Vuex);

export interface RootStateInterface {
  auth: UserStateInterface,
  componentProps: ComponentPropsStateInterface,
  navMenu: NavMenuStateInterface,
  page: PageStateInterface,
  pages: PagesStateInterface,
  services: ServicesStateInterface,
  sidebar: SidebarStateInterface,
  sites: SitesStateInterface,
  snackbar: SnackbarStateInterface,
}

export default new Vuex.Store<RootStateInterface>({});