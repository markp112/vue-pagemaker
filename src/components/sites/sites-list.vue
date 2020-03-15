<template>
  <section>
    <div class="flex flex-row justify-between ml-12 mt-16 text-accent1">
      <h2 class="text-3xl font-bold ">My Sites</h2>
      <p class="mr-12 mt-2 font-medium" v-if="isNeworList !== 'NewSite'">Create New
          <font-awesome-icon v-
            icon='plus-circle' 
            prefix="fas" 
            class="text-accent icon-size ml-3 mr-12 cursor-pointer hover:text-accent" 
            @click="createNewSite()" />
      </p>
    </div>
    
    <component :is="isNeworList" v-on:cancelClicked="cancelClicked()"></component>
  </section>
</template>
    
   

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import NewSite from './new-site.vue';

@Component({
  components: {
    NewSite
  }
})
export default class SitesList extends Vue {
  name = "SitesList" ;
  isNeworList = "";

  createNewSite(): void {
    this.isNeworList = "NewSite"
  }

  cancelClicked() {
    this.isNeworList = '';
  }

}
</script>

<style lang="postcss" scoped>
  
</style>