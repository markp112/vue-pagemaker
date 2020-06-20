<template>
    <div class="flex flex-row flex-wrap align-top py-0 m-0 w-screen h-screen overflow-hidden border-box font-body" >
      <nav-bar></nav-bar>
      <div class="w-full h-2 mb-2">
        <bread-crumb></bread-crumb>
      </div>
      <div class="flex flex-row justify-between w-full mt-2">
        <div class="inline-block px-1 w-2/12 ml-2 mr-2" >
          <side-bar></side-bar>
        </div>
        <div class="mt-0 px-6 w-10/12 flex-row justify-around h-full" >
          <router-view />
        </div>
      </div>
    <snack-bar></snack-bar>
    </div>
</template>
<script>

import Vue from 'vue';
import nav from './components/core/nav/nav';
import sidebar from './components/core/sidebar/sidebar'
import Snackbar from './components/base/notifications/snackbar/snackbar.vue';
import Breadcrumb from './components/core/breadcrumb/breadcrumb';
import Component from 'vue-class-component';
import { AuthModule } from '@/store/auth/auth';
import { NavMenuItemsModule } from '@/store/menus/nav-menu/nav-menu-module';
import { SidebarModule } from '@/store/sidebar/sidebar';
@Component({
  components:{
    'nav-bar': nav,
    'side-bar': sidebar,
    'snack-bar': Snackbar,
    'bread-crumb': Breadcrumb,
  },
})
export default class extends Vue{
 
  created() {
    if(AuthModule.isExistingUser) {
      AuthModule.getUserFromLocalStorage();
      NavMenuItemsModule.createNavMenuSignedIn();
      this.$router.push('/sites');
    } else {
      NavMenuItemsModule.createNavMenuSignedOut();
      this.$router.push('/');
    }
  }

  isLoggedIn() {
    //return AuthModule.isUserLoggedIn;
  }

  get showSidebar() {
      return SidebarModule.showSidebar;
    }
}
</script>

<style lang="postcss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
