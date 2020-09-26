

<template>
  <div class="w-screen py-3 bg-sitePrimary shadow-lg h-24 ">
    <nav class=" text-onPrimary flex items-center justify-between">
        <div class="ml-8">
          <font-awesome-icon icon='language' prefix='fas' class="text-primary-200 icon-size" />
        </div>
        <div class="mr-2 flex justify-between relative">
          <font-awesome-icon 
            icon='bars' 
            prefix="fas" 
            class="ml-2 text-primary-200 cursor-pointer hamburger hover:text-primary-100" 
            @click="toggleMenu = !toggleMenu"
          />
        <div class="flex justify-end toggleable z-10 absolute top-0 right-0 " v-if="toggleMenu">
          <ul
            class=" w-20 mr-1 dropdown-menu-background z-10 rounded-lg shadow-lg"
            @mouseleave="toggleMenu = !toggleMenu"
          >
            <li v-for="(menuItem, idx) in menuItems" 
              :key="idx"
              @click="menuItemClick(idx, menuItem.isVisible)" 
              v-show="getIsVisible(menuItem.isVisible)"
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
import { IsVisible, NavMenuItem } from '../../../models/menus/nav-menu';
import Component from 'vue-class-component';
import { NavMenuItemsModule } from '@/store/menus/nav-menu/nav-menu-module';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';

@Component
export default class NavMenuComponent extends Vue {
      name = 'NavMenuComponent'
      toggleMenu = false;
      siteDefaults = SiteDefaults.getInstance();

  menuItemClick(id: number, isVisbile: IsVisible) {
    console.log('%c%s', 'color: #00b300', isVisbile())

    this.$router.push(this.menuItems[id].navLink);
    this.toggleMenu = !this.toggleMenu;
  }

  get menuItems () {
    return  NavMenuItemsModule.navMenuItems;
  }

  get getIsVisible(): (isVisible: IsVisible) => boolean {
    return (isVisible) =>{
      console.log('%c⧭', 'color: #1d5673', isVisible)
       return isVisible();
       }
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