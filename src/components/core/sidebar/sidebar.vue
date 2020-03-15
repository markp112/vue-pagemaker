<template>
  <div class="bg-secondary h-full shadow shadow-lg" v-bind:class="{'side-bar-show': isShowSideBar, 'side-bar-hidden': !isShowSideBar }">
    <div class="flex flex-row justify-end">

      <font-awesome-icon 
        v-if="isShowSideBar"
        icon='chevron-circle-left' 
        prefix="fas" 
        class="text-accent2 icon-size mr-2 mt-2 cursor-pointer hover:text-accent" 
        @click="chevronClicked()" />
      <font-awesome-icon 
        v-if="!isShowSideBar"
        icon='chevron-circle-right' 
        prefix="fas" 
        class="text-accent2 icon-size mr-2 mt-2 cursor-pointer hover:text-accent" 
        @click="chevronClicked()" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class SideBar extends Vue {
  isShowSideBar = true;

  chevronClicked() {
    this.isShowSideBar = !this.isShowSideBar;
  }
}
</script>

<style lang="postcss">
   .icon-size {
    font-size: 1.5em;
  }

  .side-bar-show {
    @apply w-full;
  }

  .side-bar-hidden {
    @apply w-3/12;
  }
</style>