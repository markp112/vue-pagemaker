<template>
  <div id="app" class="h-screen">
    <nav-bar></nav-bar>
    <div class="flex flex-row h-full w-screen">
      <div class="self-start h-full  w-1/12" v-if="isLoggedIn()">
        <side-bar></side-bar>
      </div>
      <div class="w-screen font-Dosis">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>

import nav from '@/components/core/nav/nav';
import sidebar from '@/components/core/sidebar/sidebar'


export default {
  components:{
    'nav-bar': nav,
    'side-bar': sidebar,
  },
   created() {
    
    if(this.$store.getters.isExistingUser)  {
      this.$store.dispatch('getUserFromLocalStorage');
      this.$store.dispatch('createNavMenuSignedIn');
      this.$router.push("/sites");
    } else {
      this.$store.dispatch("createNavMenuSignedOut");
      this.$router.push("/");
    }
  },
methods: {
  isLoggedIn() {
    return this.$store.getters.isUserLoggedIn;
  }
},
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>
