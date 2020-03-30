
import {Module, VuexModule, MutationAction, Mutation, Action} from 'vuex-module-decorators'
import { NavMenuItem } from '@/models/menus/nav-menu';

@Module({name: 'navMenu' })
export default class NavMenuItemsModule extends VuexModule {
  menuItems: NavMenuItem[] = [];
  

  @Mutation addNav(menuItem: NavMenuItem) {
    if(menuItem !== undefined){
      this.menuItems.push(menuItem);
    }
  }

  @Mutation clearNav() {
    this.menuItems = [];
  }

  @Action ({commit:'addNav'}) createNavMenuSignedOut(){
    this.context.commit('clear');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Login', '/login');
    this.context.commit('addNav',menuItem);
    menuItem = new NavMenuItem(1, 'Register', '/register');
    this.context.commit('addNav',menuItem);
  }

  @Action ({commit:'addNav'}) createNavMenuSignedIn(){
    this.context.commit('clearNav');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Profile', '/profile');
    this.context.commit('addNav',menuItem);
    menuItem = new NavMenuItem(1, 'Settings', '/settings');
    this.context.commit('addNav',menuItem);
    menuItem = new NavMenuItem(1, 'Admin', '/iconeditor');
    this.context.commit('addNav', menuItem);
  }

  get navMenuItems():NavMenuItem[] {
    return this.menuItems;
  }
}