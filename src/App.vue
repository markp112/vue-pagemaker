<template>
  <div class="w-screen h-screen overflow-hidden border-box font-body" >
    <nav-bar></nav-bar>
      <bread-crumb></bread-crumb>
    <div class="flex flex-row justify-between w-full mt-2">
      <div class="inline-block  w-2/12 ml-0 mr-2" >
        <side-bar></side-bar>
      </div>
      <div class="mt-0 px-6 w-10/12 flex-row justify-around h-full" >
        <router-view />
      </div>
    </div>
    <snack-bar></snack-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import nav from '../src/components/core/nav/nav.vue';
import sidebar from '../src/components/core/sidebar/sidebar.vue';
import Snackbar from '@/components/base/notifications/snackbar/snackbar.vue';
import Breadcrumb from '@/components/core/breadcrumb/breadcrumb.vue';
import { AuthModule } from '@/store/auth/auth';
import { NavMenuItemsModule } from '@/store/menus/nav-menu/nav-menu-module';

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
}
</script>

