import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import { NavMenuItem } from '@/models/menus/nav-menu';

export interface NavMenuStateInterface {
  menuItems: NavMenuItem[],
}
@Module({ name: 'navMenu', dynamic: true, store })
class NavMenuItemsStore extends VuexModule implements NavMenuStateInterface {
  menuItems: NavMenuItem[] = [];

  @Mutation
  private addNav(menuItem: NavMenuItem) {
    if(menuItem !== undefined){
      this.menuItems.push(menuItem);
    }
  }

  @Mutation
  private clearNav() {
    this.menuItems = [];
  }

  @Action
  public createNavMenuSignedOut(){
    this.context.commit('clear');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Login', '/login');
    this.context.commit('addNav',menuItem);
    menuItem = new NavMenuItem(1, 'Register', '/register');
    this.context.commit('addNav',menuItem);
  }

  @Action
  public createNavMenuSignedIn(){
    this.context.commit('clearNav');
    let menuItem: NavMenuItem = new NavMenuItem(0, 'Profile', '/profile');
    this.context.commit('addNav',menuItem);
    menuItem = new NavMenuItem(1, 'Settings', '/settings');
    this.context.commit('addNav',menuItem);
    menuItem = new NavMenuItem(1, 'Admin', '/iconeditor');
    this.context.commit('addNav', menuItem);
  }

  public get navMenuItems():NavMenuItem[] {
    return this.menuItems;
  }
}

export const NavMenuItemsModule = getModule(NavMenuItemsStore);