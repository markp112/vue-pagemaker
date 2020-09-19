<template>
  <div class="sidebar-panel">
    <span class="inline-block flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <p class=" mt-3 text-lg">Settings</p>
    <div class="mr-2 mt-4">
      <div
        v-for="(toolbar, index) in $props.toolbarPanel.sidebarPanels"
        :key="index"
      >
        <sidebar-toolbar
          :toolbarItems="toolbar"
          @iconClick="iconClick($event)"
        >
        </sidebar-toolbar>
      </div>
    </div>  
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { Component, Emit } from 'vue-property-decorator';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import { SidebarPanel } from '@/models/sidebar/button-definition/sidebar-buttons';
import { SidebarModule } from '@/store/sidebar/sidebar';
import SidebarToolbarScreen from '@/components/base/buttons/sidebar-buttons/sidebar-toolbar.vue';

@Component({
   props: {
      toolbarPanel: {
        default: (): SidebarPanel => {
          return new SidebarPanel();
        },
      },
    },
  components: {
    'close-button': CloseButton,
    'sidebar-toolbar': SidebarToolbarScreen,
  }
})
export default class SidebarPanelSiteSettings extends Vue {
  name="Site Settings sidebar panel"
  data= '';

    @Emit('iconClick')
    iconClick(classDef: string) {
      console.log('%c%s', 'color: #ace2e6', classDef)

    }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }
}
</script>

<style lang="postcss" scoped>

.icon-list-sidebar {
  @apply flex flex-row flex-wrap text-4xl justify-evenly w-full ;
}

.icon {
  @apply transform cursor-pointer mr-2;
}

.icon:hover {
  @apply shadow-xl -translate-x-1 -translate-y-1;
}

</style>
