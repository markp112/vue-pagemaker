<template>
  <section class="sidebar-button-panel mt-2">
    <img 
      v-for="toolbarItem in $props.toolbarItems.toolbarIcons"
      :key="toolbarItem.className"
      :src="getPath(toolbarItem.icon)" 
      class="text-accent-600 cursor-pointer hover:bg-secondary-100" 
      @click="iconClick(toolbarItem.className)" />
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { SidebarToolbar } from '@/models/sidebar/button-definition/sidebar-buttons';

  @Component({
    props: {
      toolbarItems: {
      default: (): SidebarToolbar => {
        return new SidebarToolbar();
      },
    },
    }
  })
  export default class SidebarToolbarScreen extends Vue {
    name = 'SidebarToolbarScreen';
    
    mounted() {
       console.log('%c⧭', 'color: #e57373', this.$props.toolbarItems)
    }

    @Emit('iconClick')
    iconClick($event: string) {
      return $event;
    }
    
    getPath(image: string): string {
      const path = require.context('@/assets/icons',false,/\.png$/);
       console.log('%c⧭', 'color: #997326', path(`./${image}`))
      return path(`./${image}`);
    }
  }
</script>