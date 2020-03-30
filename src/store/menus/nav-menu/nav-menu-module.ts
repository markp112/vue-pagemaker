
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
    console.log("nav clear called")
    this.menuItems = [];
  }

  @Action ({commit:'add'}) createNavMenuSignedOut(){
    this.context.commit('clear');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Login', '/login');
    this.context.commit('add',menuItem);
    menuItem = new NavMenuItem(1, 'Register', '/register');
    this.context.commit('add',menuItem);
  }

  @Action ({commit:'addNav'}) createNavMenuSignedIn(){
    this.context.commit('clearNav');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Profile', '/profile');
    this.context.commit('add',menuItem);
    menuItem = new NavMenuItem(1, 'Settings', '/settings');
    this.context.commit('add',menuItem);
  }

  get navMenuItems():NavMenuItem[] {
    return this.menuItems;
  }
}