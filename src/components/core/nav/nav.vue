

<template>
<div class="w-screen shadow shadow-xl">
  <nav class="py-3  bg-primary text-accent flex items-center justify-between">
      <div class="ml-8">
        <font-awesome-icon icon='language' prefix="fas" class="text-accent1 icon-size" />
      </div>

      <div class="mr-2 flex justify-between ">
        <font-awesome-icon 
          icon='bars' 
          prefix="fas" 
          class="ml-2 text-accent2 cursor-pointer hamburger hover:text-accent " 
          @click="toggleMenu = !toggleMenu"
        />
      </div>
  </nav>
  <div class="flex justify-end toggleable z-10" v-if="toggleMenu">
    <ul  class=" w-20 mt-1 mr-1 border bg-gray-200 z-10 rounded-lg shadow-lg">
      <li v-for="menuItem in menuItems" :key="menuItem.id" @click="menuItemClick(menuItem.id)" class="block p-1 cursor-pointer text-left hover:bg-accent hover:text-white rounded-lg ">
      {{ menuItem.navText }}
      </li>
    </ul>
  </div>
</div>
</template>

<script lang='ts'>

import { NavMenuItem } from '../../../models/menus/nav-menu';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class NavMenuComponent extends Vue {
      name = 'NavMenuComponent'
      // menuItems: NavMenuItem[] = [];
      toggleMenu = false;

  menuItemClick(id: number) {
    this.$router.push(this.menuItems[id].navLink);
    this.toggleMenu = !this.toggleMenu;
  }

  get menuItems () {
    return  this.$store.getters.navMenuItems;
  }

}

</script>

<style  scoped >
  .icon-size {
    font-size: 3em;
  }

  .hamburger {
    font-size: 2em;
  }
  
  .toggleable  {
    content: "\25BC";
    font-size: 0.9em;
    padding-left: 6px;
    position: absolute;
    right: 7px;
    top: 60px;
    z-index: 5;
  }
</style>