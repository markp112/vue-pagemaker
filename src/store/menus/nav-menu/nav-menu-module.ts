
import {Module, VuexModule, MutationAction, Mutation, Action} from 'vuex-module-decorators'
import { NavMenuItem } from '@/models/menus/nav-menu';

@Module
export default class NavMenuItems extends VuexModule {
  menuItems: NavMenuItem[] = [];
  

  @Mutation add(menuItem: NavMenuItem) {
    if(menuItem !== undefined){
      this.menuItems.push(menuItem);
    }
  }

  @Mutation clear() {
    this.menuItems = [];
  }

  @Action ({commit:'add'}) createNavMenuSignedOut(){
    this.context.commit('clear');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Login', '/login');
    this.context.commit('add',menuItem);
    menuItem = new NavMenuItem(1, 'Register', '/register');
    this.context.commit('add',menuItem);
  }

  @Action ({commit:'add'}) createNavMenuSignedIn(){
    this.context.commit('clear');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Profile', '/profile');
    this.context.commit('add',menuItem);
    menuItem = new NavMenuItem(1, 'Settings', '/settings');
    this.context.commit('add',menuItem);
  }

  get navMenuItems():NavMenuItem[] {
    return this.menuItems;
  }
}