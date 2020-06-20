

<template>
  <div class="w-screen py-3 bg-primary-800 shadow shadow-lg h-24 ">
    <nav class=" text-accent-600 flex items-center justify-between">
        <div class="ml-8">
          <font-awesome-icon icon='language' prefix='fas' class="text-secondary-200 icon-size" />
        </div>
        <div class="mr-2 flex justify-between relative">
          <font-awesome-icon 
            icon='bars' 
            prefix="fas" 
            class="ml-2 text-secondary-200 cursor-pointer hamburger hover:text-primary-100" 
            @click="toggleMenu = !toggleMenu"
          />
        <div class="flex justify-end toggleable z-10 absolute top-0 right-0 " v-if="toggleMenu">
          <ul
            class=" w-20 mr-1 dropdown-menu-background z-10 rounded-lg shadow-lg"
            @mouseleave="toggleMenu = !toggleMenu"
          >
            <li v-for="(menuItem, idx) in menuItems" 
              :key="idx" 
              @click="menuItemClick(idx)" 
              class="block p-1 text-left dropdown-menu-item rounded-lg ">
            {{ menuItem.navText }}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang='ts'>

import Vue from 'vue';
import { NavMenuItem } from '../../../models/menus/nav-menu';
import Component from 'vue-class-component';
import { NavMenuItemsModule } from '@/store/menus/nav-menu/nav-menu-module';

@Component
export default class NavMenuComponent extends Vue {
      name = 'NavMenuComponent'
      toggleMenu = false;

  menuItemClick(id: number) {
    this.$router.push(this.menuItems[id].navLink);
    this.toggleMenu = !this.toggleMenu;
  }

  get menuItems () {
    return  NavMenuItemsModule.navMenuItems;
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
    top: 40px;
    z-index: 5;
  }
</style>