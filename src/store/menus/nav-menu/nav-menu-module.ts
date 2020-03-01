
import {Module, VuexModule, MutationAction, Mutation, Action} from 'vuex-module-decorators'
import { NavMenuItem } from '@/models/menus/nav-menu';

@Module
export default class NavMenuItems extends VuexModule {
  menuItems: NavMenuItem[] = [];
  

  @Mutation add(menuItem: NavMenuItem) {
    this.menuItems.push(menuItem);
  }

  @Mutation clear() {
    this.menuItems = [];
  }

  @Action ({commit:'add'}) createNavMenu(){
    let menuItem: NavMenuItem = new NavMenuItem(0, 'login', '/login');
    this.context.commit('add',menuItem);
    menuItem = new NavMenuItem(1, 'register', '/register');
    this.context.commit('add',menuItem);
    console.log('%c%s', 'color: #00a3cc', this.menuItems, "Store -> createMenu");
  }

  @Action ({commit: 'clear'}) clearNavMenu(){
    this.context.commit('clear');
  }

  get navMenuItems():NavMenuItem[] {
    return this.menuItems;
  }
}