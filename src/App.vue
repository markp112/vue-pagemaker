<template>
  <div class="font-dosis h-screen">
    <div class="flex flex-row flex-wrap py-0 m-0 w-screen" >
      <nav-bar></nav-bar>
      <div class="flex flex-col justify-start w-full h-4 mb-2">
        <bread-crumb></bread-crumb>
      </div>
      <div class="flex flex-row justify-start w-full mt-2">
        <div v-if="showSidebar" class="inline-block px-6 w-2/12 " >
          <side-bar></side-bar>
        </div>
        <div class=" mt-0 px-6 w-10/12" >
          <router-view />
        </div>
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
    if(this.$store.getters.isExistingUser)  {
      this.$store.dispatch('getUserFromLocalStorage');
      this.$store.dispatch('createNavMenuSignedIn');
      this.$router.push("/sites");
    } else {
      this.$store.dispatch("createNavMenuSignedOut");
      this.$router.push("/");
    }
  }



  isLoggedIn() {
    return this.$store.getters.isUserLoggedIn;
  }


  get showSidebar(){
    console.log("App.showsidebar")
    return this.$store.getters.showSidebar;
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
