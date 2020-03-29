<template>
  <div class="font-dosis">
    <div class="flex flex-row flex-wrap py-0 m-0 w-screen" >
      <nav-bar></nav-bar>
      <div class="flex flex-col justify-start w-1/5">
        <bread-crumb></bread-crumb>
        <div class="shadow shadow-xl">
        <side-bar></side-bar>
        </div>
      </div>
      
      <div class="container mt-0 px-6 w-4/5" >
        <router-view />
      </div>
    </div>
    <snack-bar></snack-bar>
  </div>

</template>
<script>

import nav from './components/core/nav/nav';
import sidebar from './components/core/sidebar/sidebar'
import Snackbar from './components/base/notifications/snackbar/snackbar.vue';
import Breadcrumb from './components/core/breadcrumb/breadcrumb';


export default {
  components:{
    'nav-bar': nav,
    'side-bar': sidebar,
    'snack-bar': Snackbar,
    'bread-crumb': Breadcrumb,
  },
  
  created() {
    if(this.$store.getters.isExistingUser)  {
      this.$store.dispatch('getUserFromLocalStorage');
      this.$store.dispatch('createNavMenuSignedIn');
      // this.$router.push("/sites");
    } else {
      this.$store.dispatch("createNavMenuSignedOut");
      // this.$router.push("/");
    }
  },


methods: {
  isLoggedIn() {
    return this.$store.getters.isUserLoggedIn;
  },

},
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
